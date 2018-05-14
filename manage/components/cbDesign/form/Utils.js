import hoistStatics from 'hoist-non-react-statics';

export default {

    // setFieldsValue 调用时的tree才有可能是真正的复杂对象，案例nested-field 中的setFieldsValue方法 
    // 一个复杂的对象例子： w.x.y.z[0] 或 member[0].name.firstname
    // 该递归方法就是在对象中寻找是否存在fieldsMeta 的item.name 路径，如果存在则返回该路径字符串
    treeTraverse(path = '', tree, isLeafNode, errorMessage, callback) {
        if (isLeafNode(path, tree)) {
            // 这个回调函数的两个参数都是必要的， FieldsStore.flattenFields 用到第二个参数
            callback(path, tree)
        } else if (tree === undefined) {
            return
        } else if (Array.isArray(tree)) {
            tree.forEach((subTree, index) => this.treeTraverse(
                `${path}[${index}]`,
                subTree,
                isLeafNode,
                errorMessage,
                callback
            ));
        } else { // It's object and not a leaf node
            if (typeof tree !== 'object') {
                console.error(errorMessage)
                return
            }
            Object.keys(tree).forEach(subTreeKey => {
                const subTree = tree[subTreeKey]
                this.treeTraverse(
                    `${path}${path ? '.' : ''}${subTreeKey}`,
                    subTree,
                    isLeafNode,
                    errorMessage,
                    callback
                );
            });
        }
    },

    flattenFields(maybeNestedFields, isLeafNode, errorMessage) {
        const fields = {}
        this.treeTraverse(undefined, maybeNestedFields, isLeafNode, errorMessage, (path, node) => {
            fields[path] = node
        });
        return fields
    },


    getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName || WrappedComponent.name || 'WrappedComponent';
    },

    argumentContainer(Container, WrappedComponent) {
        /* eslint no-param-reassign:0 */
        Container.displayName = `Form(${this.getDisplayName(WrappedComponent)})`;
        Container.WrappedComponent = WrappedComponent;
        return hoistStatics(Container, WrappedComponent);
    },


    /* 处理规则，从正常写法来看不会同时存在validate与rules同写的情况，可以看下面官方给的例子，validate用于简写 
     {
       validateTrigger: 'onBlur',
       rules: [{required: true}],
     }
     // is the shorthand of
     {
       validate: [{
         trigger: 'onBlur',
         rules: [{required: true}],
       }],
     }
    这个函数处理同时传入了这几个参数时，把规则重新构造成数组(看上面的解释) */
    normalizeValidateRules(validate, rules, validateTrigger) {
        const validateRules = validate.map((item) => {
            const newItem = {
                ...item,
                trigger: item.trigger || [],
            };
            if (typeof newItem.trigger === 'string') {
                newItem.trigger = [newItem.trigger];
            }
            return newItem;
        });

        if (rules) {
            validateRules.push({
                trigger: validateTrigger ? [].concat(validateTrigger) : [],
                rules,
            });
        }

        return validateRules;
    },

    //取出validateRules内的Triggers并以数组形式返回
    getValidateTriggers(validateRules) {
        return validateRules
            .filter(item => !!item.rules && item.rules.length)
            .map(item => item.trigger)
            .reduce((pre, curr) => pre.concat(curr), []);
    },

    getValueFromEvent(e) {
        // To support custom element
        if (!e || !e.target) {
            return e;
        }
        const { target } = e;
        return target.type === 'checkbox' ? target.checked : target.value;
    },

    hasRules(validate) {
        if (validate) {
            //some() 方法会依次执行数组的每个元素：
            //如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
            //如果没有满足条件的元素，则返回false。
            return validate.some((item) => {
                return item.rules && item.rules.length;
            });
        }
        return false;
    },

    flattenArray(arr) {
        return Array.prototype.concat.apply([], arr);
    },

    getErrorStrs(errors) {
        if (errors) {
            return errors.map((e) => {
                if (e && e.message) {
                    return e.message;
                }
                return e;
            });
        }
        return errors;
    },

    getParams(ns, opt, cb) {
        let names = ns
        let options = opt
        let callback = cb
        if (cb === undefined) {
            if (typeof names === 'function') {
                callback = names
                options = {}
                names = undefined
            } else if (Array.isArray(names)) {
                if (typeof options === 'function') {
                    callback = options
                    options = {}
                } else {
                    options = options || {}
                }
            } else {
                callback = options
                options = names || {}
                names = undefined
            }
        }
        return {
            names,
            options,
            callback,
        };
    },

    startsWith(str, prefix) {
        return str.lastIndexOf(prefix, 0) === 0;
    },

    isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    }
}