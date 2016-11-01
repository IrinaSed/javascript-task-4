'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

function sortOperations(operations) {
    var orderOperations = ['filterIn', 'or', 'and', 'sortBy', 'select', 'format', 'limit'];

    return operations.sort(function (a, b) {
        return orderOperations.indexOf(a.name) - orderOperations.indexOf(b.name);
    });
}


/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {

    var copiedСollection = collection.slice();
    var queryFunctions = sortOperations([].slice.call(arguments, 1));
    queryFunctions.forEach(function (queryFunction) {
        copiedСollection = queryFunction(copiedСollection);
    });

    return copiedСollection;
};

/*
 * Выбор полей
 * @params {...String}
 */
exports.select = function () {
    var fields = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (friend) {
            var selectedRecord = {};
            fields.forEach(function (field) {
                if (field in friend) {
                    selectedRecord[field] = friend[field];
                }
            });

            return selectedRecord;
        });
    };
};

/*
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 */

exports.filterIn = function (property, values) {
    console.info(property, values);

    return function filterIn(collection) {
        return collection.slice().filter(function (friend) {
            if (property in friend) {
                return values.indexOf(friend[property]) !== -1;
            }

            return false;
        });
    };
};

/*
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 */
exports.sortBy = function (property, order) {
    console.info(property, order);

    return function sortBy(collection) {
        return collection.slice().sort(function (a, b) {
            if (order === 'asc') {
                return a[property] - b[property];
            }

            return b[property] - a[property];
        });
    };
};

/*
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 */
exports.format = function (property, formatter) {
    console.info(property, formatter);

    return function format(collection) {
        return collection.map(function (friend) {
            if (property in friend) {
                friend[property] = formatter(friend[property]);
            }

            return friend;
        });
    };
};

/*
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 */
exports.limit = function (count) {
    console.info(count);

    return function limit(collection) {
        return collection.slice().slice(0, count);
    };
};

if (exports.isStar) {

    /*
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.or = function () {
        var filterFunctions = [].slice.call(arguments);
        var orFiltered = [];

        return function or(collection) {
            filterFunctions.forEach(function (filterFunction) {
                filterFunction(collection).forEach(function (friend) {
                    if (!(friend in orFiltered)) {
                        orFiltered.push(friend);
                    }
                });
            });

            return orFiltered;
        };
    };

    /*
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.and = function () {
        var filterFunctions = [].slice.call(arguments);

        return function and(collection) {
            var andFiltered = collection.slice();
            filterFunctions.forEach(function (filterFunction) {
                andFiltered = filterFunction(andFiltered);
            });

            return andFiltered;
        };
    };
}
