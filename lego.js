'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

function sortOperations(operations) {
    var orderOperations = ['filterIn', 'and', 'or', 'sortBy', 'select', 'format', 'limit'];

    return operations.slice().sort(function (a, b) {
        return orderOperations.indexOf(a.name) - orderOperations.indexOf(b.name);
    });
}

function copyCollection(collection) {
    var copiedСollection = collection.map(function (friend) {
        var copyObject = {};
        Object.keys(friend).forEach(function (property) {
            copyObject[property] = friend[property];
        });

        return copyObject;
    });

    return copiedСollection;
}

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var copiedСollection = copyCollection(collection);
    var queryFunctions = [].slice.call(arguments, 1);
    var sortQueryFunctions = sortOperations(queryFunctions);
    sortQueryFunctions.forEach(function (queryFunction) {
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
        return copyCollection(collection).map(function (friend) {
            return fields.reduce(function (selectedRecord, field) {
                if (field in friend) {
                    selectedRecord[field] = friend[field];
                }

                return selectedRecord;
            }, {});
        });
    };
};

/*
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 */

exports.filterIn = function (property, values) {
    return function filterIn(collection) {
        return collection.filter(function (friend) {
            return values.indexOf(friend[property]) !== -1;
        });
    };
};

/*
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 */
exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        return collection.sort(function (a, b) {
            if (!(property in a && property in b)) {
                return 0;
            }
            if (order === 'asc') {
                return a[property] <= b[property] ? -1 : 1;
            }

            return b[property] <= a[property] ? -1 : 1;
        });
    };
};

/*
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 */
exports.format = function (property, formatter) {
    return function format(collection) {
        return collection.map(function (friend) {
            friend[property] = formatter(friend[property]);

            return friend;
        });
    };
};

/*
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 */
exports.limit = function (count) {
    return function limit(collection) {
        if (count < 1) {
            return collection;
        }

        return collection.slice(0, count);
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

        return function or(collection) {
            return collection.filter(function (friend) {
                return filterFunctions.some(function (filterFunction) {
                    return filterFunction([friend]).indexOf(friend) >= 0;
                });
            });
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
            var filteredCollection = collection;
            filterFunctions.forEach(function (filterFunction) {
                filteredCollection = filterFunction(filteredCollection);
            });

            return filteredCollection;
        };
    };
}
