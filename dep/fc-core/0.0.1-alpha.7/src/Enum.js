/**
 * @file Enum，来自于ER的枚举类，from 4.0/feature/mvc
 *
 * @author Gray Zhang(otakustay@gmail.com)
 */
define(
    function (require) {
        var u  = require('underscore');
        /**
         * 通用枚举类，用于生成一个枚举对象
         *
         * 枚举对象是业务系统中非常普遍使用的一个类型，其基本功能是将一个数字和具体的含义对应起来
         *
         * 枚举是一类数值的集合，枚举中的每一项包括3个属性：
         *
         * - `value`：对应原始的数字值
         * - `alias`：枚举项在业务中的别名，通常使用大写字母和下划线组成的常量表达方式
         * - `text`：该项显示时的文字
         *
         * 使用本类，可以简单地创建一个枚举对象，如：
         *
         * ```javascript
         * var Status = new Enum(
         *     { alias: 'NORMAL', text: '正常' },
         *     { alias: 'DISABLED', text: '禁用' },
         *     { alias: 'DELETED', text: '已删除' }
         * );
         * ```
         *
         * 传入的参数的`value`由0开始今次递增。对于`value`非递增的枚举，在构造时对指定的项传入`value`属性即可，如：
         *
         * ```javascript
         * var MouseButton = new Enum(
         *     { alias: 'LEFT', text: '左键', value: 1 },
         *     { alias: 'RIGHT', text: '右键', value: 2 },
         *     { alias: 'MIDDLE', text: '中键', value: 4 }
         * );
         * ```
         *
         * 枚举会维护2个映射，分别为`value`至`alias`及`alias`至`value`，因此可以简单地通过属性访问的方式获取`alias`或`value`：
         *
         * ```javascript
         * if (user.status === Status.DELETED) {
         *     warn('该用户已经删除');
         * }
         * ```
         *
         * @class Enum
         *
         * @alias Enum.prototype
         */
        var exports = {};

        /**
         * 构造函数
         *
         * @constructs Enum
         *
         * @param {...meta.EnumItem} items 枚举项
         */
        exports.constructor = function () {
            this.valueIndex = [];
            this.aliasIndex = {};
            this.textIndex = {};

            for (var i = 0; i < arguments.length; i++) {
                this.addElement(arguments[i]);
            }
        };

        /**
         * 为当前枚举对象添加一个{@link meta.EnumItem|枚举项}
         *
         * @method Enum#.addElement
         *
         * @param {meta.EnumItem} element 待添加的枚举项
         *
         * @throws {Error} 如果`value`或`alias`存在重复则抛出异常
         */
        exports.addElement = function (element) {
            if (typeof element !== 'object') {
                throw new Error('Argument element is not provided');
            }

            element = u.clone(element);

            if (typeof element.text !== 'string') {
                throw new Error('Enum item must contain a "text" property of type string');
            }

            if (typeof element.alias !== 'string') {
                throw new Error('Enum item must contain a "alias" property of type string');
            }

            if (element.value == null) {
                element.value = this.valueIndex.length;
            }

            if (this.hasOwnProperty(element.value)) {
                throw new Error('Already defined an element with value' + element.value + ' in this enum type');
            }

            if (this.hasOwnProperty(element.alias)) {
                throw new Error('Already defined an element with alias "' + element.alias + '" in this enum type');
            }

            this[element.value] = element.alias;
            this[element.alias] = element.value;

            this.valueIndex[element.value] = element;
            this.aliasIndex[element.alias] = element;
            this.textIndex[element.text] = element;
        };

        /**
         * 根据数值获取枚举项
         *
         * @method Enum#.fromValue
         *
         * @param {number} value 数值
         * @return {?meta.EnumItem} 对应的枚举项，未找到对应的项时返回`null`
         */
        exports.fromValue = function (value) {
            return this.valueIndex.hasOwnProperty(value) ? u.clone(this.valueIndex[value]) : null;
        };

        /**
         * 根据别名获取枚举项
         *
         * @method Enum#.fromAlias
         *
         * @param {string} alias 别名
         * @return {?meta.EnumItem} 对应的枚举项，未找到对应的项时返回`null`
         */
        exports.fromAlias = function (alias) {
            return this.aliasIndex.hasOwnProperty(alias) ? u.clone(this.aliasIndex[alias]) : null;
        };

        /**
         * 根据文字获取枚举项
         *
         * @method Enum#.fromText
         *
         * @param {string} text 文字
         * @return {?meta.EnumItem} 对应的枚举项，未找到对应的项时返回`null`
         */
        exports.fromText = function (text) {
            return this.textIndex.hasOwnProperty(text) ? u.clone(this.textIndex[text]) : null;
        };

        /**
         * 根据数值获取对应枚举项的文字
         *
         * @method Enum#.getTextFromValue
         *
         * @param {number} value 数值
         * @return {?string} 对应的文字，未找到对应的项时返回`null`
         */
        exports.getTextFromValue = function (value) {
            var element = this.fromValue(value);
            return element ? element.text : null;
        };

        /**
         * 根据文字获取对应枚举项的文字
         *
         * @method Enum#.getTextFromAlias
         *
         * @param {string} alias 文字
         * @return {?string} 对应的文字，未找到对应的项时返回`null`
         */
        exports.getTextFromAlias = function (alias) {
            var element = this.fromAlias(alias);
            return element ? element.text : null;
        };

        /**
         * 根据数值获取对应枚举项的数值
         *
         * @method Enum#.getValueFromAlias
         *
         * @param {string} alias 数值
         * @return {?number} 对应的数值，未找到对应的项时返回`null`
         */
        exports.getValueFromAlias = function (alias) {
            var element = this.fromAlias(alias);
            return element ? element.value : null;
        };

        /**
         * 根据文字获取对应枚举项的数值
         *
         * @method Enum#.getValueFromText
         *
         * @param {string} text 文字
         * @return {?number} 对应的数值，未找到对应的项时返回`null`
         */
        exports.getValueFromText = function (text) {
            var element = this.fromText(text);
            return element ? element.value : null;
        };

        /**
         * 根据数值获取对应枚举项的别名
         *
         * @method Enum#.getAliasFromValue
         *
         * @param {number} value 数值
         * @return {?string} 对应的别名，未找到对应的项时返回`null`
         */
        exports.getAliasFromValue = function (value) {
            var element = this.fromValue(value);
            return element ? element.alias : null;
        };

        /**
         * 根据文字获取对应枚举项的别名
         *
         * @method Enum#.getAliasFromText
         *
         * @param {string} text 文字
         * @return {?string} 对应的别名，未找到对应的项时返回`null`
         */
        exports.getAliasFromText = function (text) {
            var element = this.fromText(text);
            return element ? element.alias : null;
        };

        /**
         * 将当前枚举转换为数组，常用于下拉选择控件之类的数据源
         *
         * @method Enum#.toArray
         *
         * @param {...*} [hints] 用于生成数组的提示信息，数组中的每一项可以为字符串或者对象，
         * 为字符串时使用`alias`与字符串相同的{@link meta.EnumItem}对象，为对象时则直接将对象插入到当前位置。
         * 不提供此参数则直接将枚举按`value`属性进行排序生成数组返回
         * @return {meta.EnumItem[]} 每次返回一个全新的数组副本
         */
        exports.toArray = function () {
            var array = [];
            var i;
            if (arguments.length > 0) {
                for (i = 0; i < arguments.length; i++) {
                    var hint = arguments[i];
                    if (typeof hint === 'string') {
                        array.push(this.fromAlias(hint));
                    }
                    else {
                        array.push(hint);
                    }
                }
            }
            else {
                // 必须做一次复制操作，不能让外部的修改影响枚举结构
                for (i = 0; i < this.valueIndex.length; i++) {
                    // 由于`value`不一定是连续的，所以一定要去除空项
                    if (this.valueIndex[i]) {
                        array.push(this.valueIndex[i]);
                    }
                }
            }
            return array;
        };

        var Enum = require('eoo').create(exports);
        return Enum;
    }
);
