var exampleApp = angular.module("exampleApp", ["ngResource", "ngRoute"])

    .constant("baseUrl", "http://localhost:2403/autors/")
    .constant("bookUrl", "http://localhost:2403/books/")
    .config(function ($locationProvider, $routeProvider) {

        $locationProvider.html5Mode(true);

        $routeProvider.when("/createBook", {
            templateUrl: "/node_modules/008_AJAX/Samples/Task/testTask/views/createBook.html"
        });

        $routeProvider.when("/table", {
            templateUrl: "/node_modules/008_AJAX/Samples/Task/testTask/views/table.html"
        });


        $routeProvider.when("/editBook", {
            templateUrl: "/node_modules/008_AJAX/Samples/Task/testTask/views/editBook.html"
        });

        $routeProvider.when("/list", {
            templateUrl: "/node_modules/008_AJAX/Samples/Task/testTask/views/list.html"
        });

        $routeProvider.when("/edit", {
            templateUrl: "/node_modules/008_AJAX/Samples/Task/testTask/views/edit.html"
        });

        $routeProvider.otherwise({
            templateUrl: "/node_modules/008_AJAX/Samples/Task/testTask/views/table.html"
        });
    });
exampleApp.controller("autorsCtrl", function ($scope, $http, $resource, baseUrl, $location) {


    $location.path("/table")

    $scope.refresh = function () {
        $scope.autors = $scope.itemsResource.query();

    }

    $scope.matchPattern = new RegExp("[а-я, a-z]");
    $scope.getError = function (error) {
        if (angular.isDefined(error)) {
            if (error.required) {
                return "Поле не должно быть пустым";
            }
            else if (error.pattern) {
                return "поле должно содержать только символы";
            }
        }
    }

    $scope.getDt = function (dt) {
        return new Date(dt);
    }

    $scope.itemsResource = $resource(baseUrl + ":id", {id: "@id"});
    $scope.create = function (autor) {
        new $scope.itemsResource(autor).$save().then(function (newAutor) {
            $scope.autors.push(newAutor);

            $location.path("/table")
        });
    }

    $scope.update = function (autor) {
        autor.$save();

        $location.path("/table")
    }

    $scope.editOrCreate = function (autor) {
        $scope.currentAutor = autor ? autor : {};
        $location.path("/edit")

    }

    $scope.saveEdit = function (autor) {
        if (angular.isDefined(autor.id)) {
            $scope.update(autor);
        } else {
            $scope.create(autor);
        }
    }

    $scope.cancelEdit = function () {
        if ($scope.currentAutor && $scope.currentAutor.$get) {
            $scope.currentAutor.$get();
        }
        $scope.currentAutor = {};

        $location.path("/table")
    }

    $scope.toTb = function () {
        $location.path("/table")
    }

    $scope.refresh();

});


exampleApp.controller("booksCtrl", function ($scope, $http, $resource, bookUrl, $location) {

    $scope.itemsResource2 = $resource(bookUrl + ":id", {id: "@id"});
    $location.path("/table")

    $scope.refresh2 = function () {
        $scope.books = $scope.itemsResource2.query();

    }


    $scope.delete = function (autor) {
        var autorId = autor.id;
        autor.$delete().then(function () {
            $scope.autors.splice($scope.autors.indexOf(autor), 1);
        });
        for (var i = 0; i < $scope.books.length; i++) {
            if ($scope.books[i].autorId == autorId) {
                $scope.books[i].$delete();
            }
        }
        $location.path("/table")
    }

    $scope.showBk = function (autor) {

        $scope.booksOfautor = [];
        for (var i = 0; i < $scope.books.length; i++) {
            if ($scope.books[i].autorId == autor.id) {
                $scope.booksOfautor.push($scope.books[i]);
            }
        }
        $location.path("/list")
    }

    $scope.editBooks = function (item) {
        $scope.currentBk = item;
        $location.path("/editBook")

    }

    $scope.createBook = function (book) {
        book.name = book.name.toLowerCase();
        book.autorId = $scope.idOfAutor

        new $scope.itemsResource2(book).$save().then(function (newBook) {
            $scope.books.push(newBook);
            $location.path("/table")
        });
    }

    $scope.crBk = function (idOfAutor) {
        $scope.idOfAutor = idOfAutor.id;

        $location.path("/createBook")
    }

    $scope.saveEditBook = function (currentBk) {
        if (currentBk) {
            $scope.updateBk(currentBk);
        }
    }

    $scope.updateBk = function (books) {
        books.$save();
        $location.path("/table")
    }

    $scope.deleteBook = function (book) {
        book.$delete();
        $location.path("/list")
    }

    $scope.search = function (nameOfBook) {
        $scope.nameOfBook = ' ';
        $scope.findedBook = ' ';

        if (nameOfBook == ' ') {
            $scope.findedBook = 'введите название книги';
            return;
        }
        for (var i = 0; i < $scope.books.length; i++) {
            if (nameOfBook.toLowerCase() == $scope.books[i].name) {
                for (var y = 0; y < $scope.autors.length; y++) {
                    if ($scope.books[i].autorId == $scope.autors[y].id) {
                        $scope.findedBook = ("книга:" + ' ' + $scope.books[i].name +
                        "   " + "автор:" + '  ' + $scope.autors[y].firstName +
                        '  ' + $scope.autors[y].lastName + '  ' + $scope.autors[y].patronymic)
                        return;
                    }
                }
            } else {
                $scope.findedBook = 'книга нe найдена';

            }
        }
    }

    $scope.cancelEditBook = function (currentBk) {
        if ($scope.currentBk && $scope.currentBk.$get) {
            $scope.currentBk.$get();
        }
        $scope.currentBk = {};
        $location.path("/table")
    }

    $scope.refresh2();
});