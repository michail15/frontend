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
exampleApp.controller("defaultCtrl", function ($scope, $http, $resource, baseUrl, $location){


    $location.path("/table")

        $scope.refresh = function () {
        $scope.autors = $scope.itemsResource.query();

    }
        $scope.getError = function (error) {
            if (angular.isDefined(error)) {
                if (error.required) {
                    return "Поле не должно быть пустым";
                }
            }
        }

        $scope.getDt = function(dt){
            return new Date(dt);
        }

        $scope.itemsResource = $resource(baseUrl + ":id", { id: "@id" });

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

        $scope.delete = function (autor) {
            autor.$delete().then(function () {
                $scope.autors.splice($scope.autors.indexOf(autor), 1);
            });
            $location.path("/table")
        }
        $scope.deleteBook = function(autorBk){
            autorBk.listOfbk={};
            $scope.update(autorBk);
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


         $scope.cancelEdit = function (currentAutor) {
            if ($scope.currentAutor && $scope.currentAutor.$get) {
               $scope.currentAutor.$get();
            }
            $scope.currentAutor = {};

             $location.path("/table")
        }
        $scope.toTb = function(){

            $location.path("/table")
        }
        $scope.refresh();

    });


exampleApp.controller("defaultCtrl2", function ($scope, $http, $resource, bookUrl, $location){

    $scope.itemsResource2 = $resource(bookUrl + ":id", { id: "@id" });
    $location.path("/table")
    $scope.refresh2 = function () {
        $scope.books = $scope.itemsResource2.query();

    }

    $scope.showBk = function(autor){

        $scope.booksOfautor =[];

        for(var i=0;i<$scope.books.length;i++){

           if($scope.books[i].autorId == autor.id){
               $scope.booksOfautor.push($scope.books[i]);
           }
        }
        $location.path("/list")
    }
    $scope.createBook = function(book){

       book.autorId=$scope.idOfAutor

        new $scope.itemsResource2(book).$save().then(function (newBook) {
            $scope.books.push(newBook);
            $location.path("/table")
        });
    }


    $scope.editBooks = function (booksOfautor) {

            $scope.currentBk = booksOfautor ;
        $location.path("/editBook")

        }

    $scope.crBk = function(idOfAutor){
    $scope.idOfAutor=idOfAutor.id;
        $location.path("/createBook")
    }

        $scope.saveEditBook = function (itemBook) {
            var bkk={};
        for(var i=0; i<$scope.books.length; i++){
            if($scope.books[i].autorId==itemBook.autorId&&$scope.books[i].name==itemBook.name){
                 $scope.books[i].name = itemBook.name;
                 $scope.books[i].janre = itemBook.janre;
                $scope.books[i].quant = itemBook.quant;
                 bkk = $scope.books[i];
         }

        }
        $scope.updateBk(bkk);
    }
    $scope.updateBk = function (books) {
        books.$save();
        $location.path("/table")
    }

    $scope.refresh2();
});