import React, { Component } from 'react'
import ClassNames from 'classnames'
import AsyncValidator from 'async-validator'
import warning from 'warning'
import get from 'lodash/get'
import set from 'lodash/set'
import CreateFieldsStore from './createFieldsStore'
import Utils from '../Utils'

// 该代码中，不会直接修复Field 和FieldMeta中的任何数据，因为他们是值引用类型。由setFieldMeta 和 setFields 统一修改，
// 任何修改Field 和FieldMeta的操作，都先复制他们对象，在新对象中修改值，然后将新对象作为参数传递给setFieldMeta 和 setFields
function CreateBaseForm(options) {

    return function decorate(WrappedComponent) {
        const Form = class BaseForm extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                }

                // 通过使用 onFieldsChange 与 mapPropsToFields，可以把表单的数据存储到上层组件或者 Redux、dva 中,处理过程有点复杂，暂时用非Redux、dva的数据处理
                // const fields = mapPropsToFields && mapPropsToFields(this.props);
                // this.fieldsStore = CreateFieldsStore(fields || {});

                //不需要将数据存储在上层组件或者 Redux、dva 中时直接创建fieldsStore
                this.fieldsStore = CreateFieldsStore({})

                this.cachedBind = {}//记录已处理的回调事件，防止事件重复bind
                this.instances = {} //用于记录ref的实例
                this.clearedFieldMetaCache = {}
            }

            componentWillMount() {
            }

            getFieldDecorator(name, fieldOption) {
                const props = this.getFieldProps(name, fieldOption)
                return (fieldElem) => {
                    const fieldMeta = this.fieldsStore.getFieldMeta(name)
                    const originalProps = fieldElem.props
                    if (process.env.NODE_ENV !== 'production') {
                        const valuePropName = fieldMeta.valuePropName
                        warning(
                            !(valuePropName in originalProps),
                            `\`getFieldDecorator\` will override \`${valuePropName}\`, ` +
                            `so please don't set \`${valuePropName}\` directly ` +
                            `and use \`setFieldsValue\` to set it.`
                        )
                        const defaultValuePropName =
                            `default${valuePropName[0].toUpperCase()}${valuePropName.slice(1)}`
                        warning(
                            !(defaultValuePropName in originalProps),
                            `\`${defaultValuePropName}\` is invalid ` +
                            `for \`getFieldDecorator\` will set \`${valuePropName}\`,` +
                            ` please use \`option.initialValue\` instead.`
                        )
                    }

                    fieldMeta.originalProps = originalProps
                    fieldMeta.ref = fieldElem.ref
                    return React.cloneElement(fieldElem, {
                        ...props,
                        ...this.fieldsStore.getFieldValuePropValue(fieldMeta),
                    })
                }
            }

            //usersFieldOption.trigger：收集子节点的值的时机
            //usersFieldOption.validateTrigger：校验子节点值的时机
            //usersFieldOption.validate:当存在多个触发校验事件时，如focus时触发，blur时触发，onchange时也触发，用validate来传递
            // 每次调用setFields时都会强制刷新界面，render时就会调用到该方法给组件返回参数
            // 不管valuePropName 有值还是没值，fields保存的值属性一直是value而不是valuePropName
            getFieldProps(name, usersFieldOption = {}) {
                if (!name) {
                    throw new Error('Must call `getFieldProps` with valid name string!')
                }
                if (process.env.NODE_ENV !== 'production') {

                }

                delete this.clearedFieldMetaCache[name]

                const fieldOption = {
                    name,
                    trigger: 'onChange', // 收集子节点的值的时机,如果input是输入框，trigger不是onchange值无法变化，这样就没有意义了。
                    valuePropName: 'value', //设置子节点的值的属性，如 Switch 的是 'checked'，默认取字段的值用value，该字段可以改变取值名称
                    validate: [],
                    ...usersFieldOption, //此处如果与上面有相同的属性会覆盖掉上面的，上面写的相当于默认值
                }

                const {
                    rules,
                    trigger, //这个使用来获取值的，默认值为'onChange'，如果validateTrigger未传过来，默认值也是onChange
                    validateTrigger = trigger, //这个语法要注意(变量的解构赋值)，validateTrigger在不为undefined(null与undefined是不同的)时是取自己的值，只有为undefined时才会执行validateTrigger = trigger
                    validate,
                } = fieldOption

                //getFieldValuePropValue 处理option.getValueProps 和option.valuePropName, 诸如checkbox 、radio需要使用checked字段来赋默认值的，需传入valuePropName，否则传给子组件的参数就是value
                const inputProps = {
                    ...this.fieldsStore.getFieldValuePropValue(fieldOption), // 如果value无值这里会将赋默认值
                    ref: this.getCacheBind(name, `${name}__ref`, this.saveRef), //ref 绑定saveRef
                }

                //用于保存字段名称用的，没有其他特殊作用，例子也未见使用
                //注意，options是createForm(options)传入的参数，不是getFieldProps的第二个参数，不要搞混乱了
                if (options && options.fieldNameProp) {
                    inputProps[options.fieldNameProp] = name
                }

                //validate的作用与 rules, validateTrigger的组合相同，该方法将rules, validateTrigger转换为validate的格式数组，并将两个数组合并返回。
                const validateRules = Utils.normalizeValidateRules(validate, rules, validateTrigger)

                // 取validateRules内的trigger属性，以数组形式返回
                const validateTriggers = Utils.getValidateTriggers(validateRules)

                // 校验事件绑定
                validateTriggers.forEach((action) => {

                    //这个判断在正常情况下都不会return，不知道redux或dva是否会走，从代码上看是多余的
                    if (inputProps[action]) return
                    //将validateTriggers 与 onCollectValidate绑定起来
                    inputProps[action] = this.getCacheBind(name, action, this.onCollectValidate)
                })


                // make sure that the value will be collect
                // 假设trigger不在validateTriggers数组中，onCollect事件是不会触发校验机制的
                if (trigger && validateTriggers.indexOf(trigger) === -1) {
                    // 绑定事件，但不触发校验机制
                    inputProps[trigger] = this.getCacheBind(name, trigger, this.onCollect)
                }

                const fieldMeta = this.fieldsStore.getFieldMeta(name)

                // 这三行代码是多余的，作者也懵逼了，因为更新入口点要规范在setFieldMeta中
                // if ('initialValue' in fieldOption) {
                //     fieldMeta.initialValue = fieldOption.initialValue
                // }

                const meta = {
                    ...fieldMeta,
                    ...fieldOption,
                    validate: validateRules,
                }

                this.fieldsStore.setFieldMeta(name, meta)

                //fieldMetaProp: Where to store the meta data of getFieldProps
                //注意，options是createForm(options)传入的参数，不是getFieldProps的第二个参数，不要搞混乱了
                if (options && options.fieldMetaProp) {
                    inputProps[options.fieldMetaProp] = meta
                }

                //fieldDataProp: Where to store the field data
                //注意，options是createForm(options)传入的参数，不是getFieldProps的第二个参数，不要搞混乱了
                if (options && options.fieldDataProp) {
                    inputProps[options.fieldDataProp] = this.fieldsStore.getField(name)
                }

                //value 需要一个默认值否则 页面会警告 'A component is changing an uncontrolled input of type checkbox to be controlled'
                // 加了这个会有个小问题，即输入框的trigger不是onChange时，无法触发改变事件。
                if (fieldOption.valuePropName === 'value' && inputProps[fieldOption.valuePropName] === undefined) {
                    inputProps['value'] = ''
                }

                return inputProps
            }

            // 与onCollectValidate 都调用了onCollectCommon ，但是这个没有调用validateFieldsInternal，可以根据执行结果判定validateFieldsInternal作用
            onCollect(name_, action, e) {
                const { name, field, fieldMeta } = this.onCollectCommon(name_, action, e)
                const { validate } = fieldMeta
                const newField = {
                    ...field,
                    dirty: Utils.hasRules(validate), //如果validate内的rule存在则为true，暂时不知道该字段作用
                }

                //缓存新数据
                this.setFields({
                    [name]: newField,
                })
            }

            //原方法是这么写的 onCollectValidate(name, action, ...args) 这是es6剩余参数的写法，但是在更深的getValueFromEvent方法中却只处理了一个参数，所以用剩余参数的写法有些多余，不利于理解，我改成了常用的e作为参数
            onCollectValidate(name, action, e) {

                // onCollectCommon大部分代码都是从内存中读数据，暂时还不知道内存中保存的数据的作用
                const { field, fieldMeta } = this.onCollectCommon(name, action, e)
                const newField = {
                    ...field,
                    dirty: true
                }

                // 处理字段校验
                this.validateFieldsInternal([newField], {
                    action,
                    options: { // AsyncValidator 用到 firstFields ，所以要在这里传递。
                        firstFields: !!fieldMeta.validateFirst,
                    }
                })
            }

            //获取字段的相关信息，返回值包含field及fieldMeta
            onCollectCommon(name, action, e) {

                const fieldMeta = this.fieldsStore.getFieldMeta(name)

                //如果trigger 与 option 有同名函数，执行回调函数, 例如 option.trigger:'onChange' 与option.onChange = ()=>{}
                //如果业务有需求处理同名函数事件则会触发回调
                if (fieldMeta[action]) {
                    fieldMeta[action](e)
                } else if (fieldMeta.originalProps && fieldMeta.originalProps[action]) { //getFieldDecorator 会给originalProps赋值
                    fieldMeta.originalProps[action](e)
                }

                // 获取值，如果需要自己获取值则传入option.getValueFromEvent 进行回调
                /** 可以把 onChange 的参数转化为控件的值，例如 DatePicker 可设为：(date, dateString) => dateString */
                const value = fieldMeta.getValueFromEvent ? fieldMeta.getValueFromEvent(e) : Utils.getValueFromEvent(e)

                // onValuesChange是参数方法，父组件的回调函数
                //注意，options是createForm(options)传入的参数，不是getFieldProps的第二个参数，不要搞混乱了
                // antd 的注解 任一表单域的值发生改变时的回调 , 注意if理的第二个条件，该条件针对非onChange的触发事件，比如onClick,这时候值有可能是一样的，radio就是这么一个这样的控件
                if (options && options.onValuesChange && value !== this.fieldsStore.getFieldValue(name)) {
                    const valuesAll = this.fieldsStore.getAllValues()
                    const valuesAllSet = {}
                    valuesAll[name] = value
                    Object.keys(valuesAll).forEach(key => set(valuesAllSet, key, valuesAll[key]))
                    options.onValuesChange(this.props, set({}, name, value), valuesAllSet)
                }

                const field = this.fieldsStore.getField(name)

                return ({ name, field: { ...field, value, touched: true }, fieldMeta })
            }

            // 处理字段校验，创建AsyncValidator校验器校验value是否有效，AsyncValidator内部实现是正则
            validateFieldsInternal(fields, {
                fieldNames,
                action,
                options = {},
            }, callback) {
                const allRules = {}
                const allValues = {}
                const allFields = {}
                const alreadyErrors = {} //英文字面意思：先前的错误

                // 这个循环是给 allRules、 allValues、 allFields、alreadyErrors赋值
                // 来源为onCollectValidate 时，校验的是一个字段，fields只有一个值，当来源是validateFields 时就不是一个字段了
                fields.forEach((field) => {
                    const name = field.name

                    // options.force :对已经校验过的表单域，在 validateTrigger 再次被触发时是否再次校验,属于validateFields(options) 的参数，为true时表示继续校验
                    // dirty表示脏校验 ， validateFieldsInternal 有回调函数，不知道是不是这个原因才这么写
                    // 整个判断表示 已校验过但数据未被脏写，注意这里是在forEach内，这个return 相当于for循环的continue 
                    // 通过onCollectValidate 调用时永远不会这些这个if里的代码的，因为 dirty 赋值为true
                    if (options.force !== true && field.dirty === false) {
                        // 存在错误信息则将信息 记录到 临时变量alreadyErrors中
                        if (field.errors) {
                            //设置对象的路径上的属性值.如果路径不存在，则创建它.相当于 alreadyErrors.name = { errors: field.errors }
                            set(alreadyErrors, name, { errors: field.errors })
                        }
                        return
                    }

                    const fieldMeta = this.fieldsStore.getFieldMeta(name)

                    const newField = {
                        ...field,
                    }

                    newField.errors = undefined
                    newField.validating = true
                    newField.dirty = true

                    allRules[name] = this.getRules(fieldMeta, action)
                    allValues[name] = newField.value
                    allFields[name] = newField
                })

                //先更新数据
                this.setFields(allFields)

                // in case normalize(如果options.normalize 存在时，setFields会修改值(比如小写转大写)，allFields保持的是真实输入值，所以这里需从fieldsStore里再取一次值)
                Object.keys(allValues).forEach((f) => {
                    allValues[f] = this.fieldsStore.getFieldValue(f)
                })

                // 如果有回调函数直接返回了 ,且allFields是空的时候直接返回
                if (callback && Utils.isEmptyObject(allFields)) {
                    callback(Utils.isEmptyObject(alreadyErrors) ? null : alreadyErrors, this.fieldsStore.getFieldsValue(fieldNames))
                    return
                }

                // 创建校验器，这个AsyncValidator也是作者写的一个库，专门用于正则表达式校验数据
                const validator = new AsyncValidator(allRules)

                // 如果有自定义错误信息，使用自定义的信息(AsyncValidator 有默认的错误信息，全英文的)
                // validateMessages 格式 {name:{type: "string", required: true, message: "Name is required"}}，可以将message改成中文
                if (options && options.validateMessages) {
                    validator.messages(options.validateMessages)
                }

                validator.validate(allValues, options, (errors) => {
                    const errorsGroup = {
                        ...alreadyErrors,
                    }
                    if (errors && errors.length) {
                        errors.forEach((e) => {
                            const fieldName = e.field

                            // 获取errorsGroup 路径fieldName 内的值
                            const field = get(errorsGroup, fieldName)
                            if (typeof field !== 'object' || Array.isArray(field)) {
                                // 给errorsGroup对象赋值，赋值路径为fieldName，不存在该路径则创建，最后一个参数为值
                                set(errorsGroup, fieldName, { errors: [] })
                            }

                            // 获取上一步拼接好的errors
                            const fieldErrors = get(errorsGroup, fieldName.concat('.errors'))
                            // 引用类型，fieldErrors即对errorsGroup的操作
                            fieldErrors.push(e)
                        })
                    }
                    const expired = []
                    const nowAllFields = {}

                    Object.keys(allRules).forEach((name) => {
                        const fieldErrors = get(errorsGroup, name)
                        const nowField = this.fieldsStore.getField(name)
                        // avoid concurrency problems
                        if (nowField.value !== allValues[name]) {
                            expired.push({
                                name,
                            })
                        } else {
                            nowField.errors = fieldErrors && fieldErrors.errors
                            nowField.value = allValues[name]
                            nowField.validating = false
                            nowField.dirty = false
                            nowAllFields[name] = nowField
                        }
                    })

                    this.setFields(nowAllFields)

                    if (callback) {
                        if (expired.length) {
                            expired.forEach(({ name }) => {
                                const fieldErrors = [{
                                    message: `${name} need to revalidate`,
                                    field: name,
                                }]
                                set(errorsGroup, name, {
                                    expired: true,
                                    errors: fieldErrors,
                                })
                            })
                        }

                        callback(Utils.isEmptyObject(errorsGroup) ? null : errorsGroup,
                            this.fieldsStore.getFieldsValue(fieldNames))
                    }
                })
            }

            // setFields会强制刷新界面
            setFields(maybeNestedFields, callback) {

                const fields = this.fieldsStore.flattenRegisteredFields(maybeNestedFields)

                // 这个方法里，如果fieldsMeta里有normalize 函数，会进行回调并改变值
                this.fieldsStore.setFields(fields)

                if (options && options.onFieldsChange) {
                    const changedFields = Object.keys(fields)
                        .reduce((acc, name) => set(acc, name, this.fieldsStore.getField(name)), {})
                    options.onFieldsChange(this.props, changedFields, this.fieldsStore.getNestedAllFields())
                }

                this.forceUpdate(callback)
            }

            // 对外提供的更改字段的方法
            setFieldsValue(changedValues, callback) {
                const { fieldsMeta } = this.fieldsStore
                const values = this.fieldsStore.flattenRegisteredFields(changedValues)
                const newFields = Object.keys(values).reduce((acc, name) => {
                    const isRegistered = fieldsMeta[name]
                    if (process.env.NODE_ENV !== 'production') {
                        warning(
                            isRegistered,
                            'Cannot use `setFieldsValue` until ' +
                            'you use `getFieldDecorator` or `getFieldProps` to register it.'
                        );
                    }
                    if (isRegistered) {
                        const value = values[name];
                        acc[name] = {
                            value,
                        }
                    }
                    return acc
                }, {})
                this.setFields(newFields, callback);
                if (options && options.onValuesChange) {
                    const allValues = this.fieldsStore.getAllValues();
                    options.onValuesChange(this.props, changedValues, allValues);
                }
            }

            resetFields(ns) {
                const newFields = this.fieldsStore.resetFields(ns)
                if (Object.keys(newFields).length > 0) {
                    this.setFields(newFields)
                }
                if (ns) {
                    const names = Array.isArray(ns) ? ns : [ns]
                    names.forEach(name => delete this.clearedFieldMetaCache[name])
                } else {
                    this.clearedFieldMetaCache = {}
                }
            }

            //校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件 antd的注解
            validateFields(ns, opt, cb) {
                const { names, callback, options } = Utils.getParams(ns, opt, cb);
                const fieldNames = names ?
                    this.fieldsStore.getValidFieldsFullName(names) :
                    this.fieldsStore.getValidFieldsName();
                const fields = fieldNames
                    .filter(name => {
                        const fieldMeta = this.fieldsStore.getFieldMeta(name);
                        return Utils.hasRules(fieldMeta.validate);
                    }).map((name) => {
                        const field = this.fieldsStore.getField(name);
                        field.value = this.fieldsStore.getFieldValue(name);
                        return field;
                    });
                if (!fields.length) {
                    if (callback) {
                        callback(null, this.fieldsStore.getFieldsValue(fieldNames));
                    }
                    return;
                }
                if (!('firstFields' in options)) {
                    options.firstFields = fieldNames.filter((name) => {
                        const fieldMeta = this.fieldsStore.getFieldMeta(name);
                        return !!fieldMeta.validateFirst;
                    });
                }
                this.validateFieldsInternal(fields, {
                    fieldNames,
                    options,
                }, callback);
            }

            getRules(fieldMeta, action) {
                const actionRules = fieldMeta.validate.filter((item) => {
                    return !action || item.trigger.indexOf(action) >= 0
                }).map((item) => item.rules)

                return Utils.flattenArray(actionRules)
            }

            //事件绑定,将绑定的事件记录在cachedBind中，然后返回bind后的事件
            getCacheBind(name, action, fn) {
                if (!this.cachedBind[name]) {
                    this.cachedBind[name] = {}
                }
                const cache = this.cachedBind[name]
                if (!cache[action]) {
                    cache[action] = fn.bind(this, name, action)
                }
                return cache[action]
            }

            //将组件实例dom保存到instances中
            saveRef(name, _, component) {
                if (!component) {
                    // after destroy, delete data
                    this.clearedFieldMetaCache[name] = {
                        field: this.fieldsStore.getField(name),
                        meta: this.fieldsStore.getFieldMeta(name),
                    }
                    this.fieldsStore.clearField(name)
                    delete this.instances[name]
                    delete this.cachedBind[name]
                    return
                }

                this.recoverClearedField(name)

                const fieldMeta = this.fieldsStore.getFieldMeta(name)
                if (fieldMeta) {
                    const ref = fieldMeta.ref
                    if (ref) { //这段代码的判断待研究
                        if (typeof ref === 'string') {
                            throw new Error(`can not set ref string for ${name}`)
                        }
                        ref(component)
                    }
                }
                this.instances[name] = component
            }

            // 组件卸载的时候，判断缓存中是否保存有FieldMeta，如果缓存存在数据调用setFieldMeta，暂时不知道是为了解决什么问题而设计此函数
            recoverClearedField(name) {
                if (this.clearedFieldMetaCache[name]) {
                    this.fieldsStore.setFields({
                        [name]: this.clearedFieldMetaCache[name].field,
                    })
                    this.fieldsStore.setFieldMeta(name, this.clearedFieldMetaCache[name].meta)
                    delete this.clearedFieldMetaCache[name]
                }
            }

            // 对外暴露的接口
            getForm() {
                return {
                    getFieldDecorator: this.getFieldDecorator.bind(this),
                    getFieldProps: this.getFieldProps.bind(this),

                    getFieldsError: this.fieldsStore.getFieldsError.bind(this.fieldsStore),
                    getFieldError: this.fieldsStore.getFieldError.bind(this.fieldsStore),

                    resetFields: this.resetFields.bind(this),

                    getFieldValue: this.fieldsStore.getFieldValue.bind(this.fieldsStore),
                    getFieldsValue: this.fieldsStore.getFieldsValue.bind(this.fieldsStore),

                    validateFields: this.validateFields.bind(this),

                    setFields: this.setFields.bind(this),
                    setFieldsValue: this.setFieldsValue.bind(this)
                }
            }

            render() {
                const { wrappedComponentRef, ...restProps } = this.props
                //将接口事件暴露给父组件
                const formProps = {
                    form: this.getForm()
                }

                // 这个是自定义组件的ref
                if (wrappedComponentRef) {
                    formProps.ref = wrappedComponentRef
                }

                return <WrappedComponent {...formProps} {...restProps} />
            }
        }

        return Form
    }
}

export default CreateBaseForm
