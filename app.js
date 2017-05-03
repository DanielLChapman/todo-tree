(function() {
	
	var app = angular.module('todoTree', ['ui.tree']);

	app.controller('MainCtrl', [ '$scope',function($scope){
		$scope.counter = 0;
		$scope.task = "";
		$scope.test = function(data) {
			console.log(data);
		}
		$scope.Node = function(task) {
			this.task = task;
			$scope.counter++;
			this.id = $scope.counter;
			this.parent = 0;
			this.children = [];
			this.complete = false;
			this.newTask = ""
			this.boolRemoved = true;
		}
		$scope.Tree = function(data) {
			var nodeM = new $scope.Node(data);
			this._root = nodeM;
		}

		//Depth-first search
		$scope.Tree.prototype.traverseDF = function(callback) {

			(function recurse(currentNode) {
				for (var i = 0; i < currentNode.children.length; i++) {
					recurse(currentNode.children[i]);
				}
				callback(currentNode);
			})(this._root)
		}

		//breadth-first search with an array instead of a queue
		$scope.Tree.prototype.traverseBF = function(callback) {
			var queue = [];
			queue.push(this._root);
			currentNode = queue.shift();
			while (currentNode) {
				for (var i = 0; i < currentNode.children.length; i++) {
					queue.push(currentNode.children[i]);
				}	
				callback(currentNode);
				currentNode = queue.shift();
			}
		}
		
		//If a higher task is marked complete, recursive search their children and their children and mark those complete as well
		$scope.Tree.prototype.completeChildren = function(node) {
			(function recurse(currentNode) {
				currentNode.complete = true;
				for (var i = 0; i < currentNode.children.length; i++) {
					recurse(currentNode.children[i]);
				}
			})(node);
		};
		//If the parents are complete but a new task is added, then the parents are no longer complete. This searches upwards.
		$scope.Tree.prototype.checkParents = function(node) {
			(function recurse(currentNode) {
				if (!currentNode.complete) {
					parent = currentNode.parent;
					if (parent != 0 && parent.complete) {
						parent.complete = false;
						recurse(parent);
					}
				}
			})(node)
		}
		$scope.Tree.prototype.contains = function(callback, traversal) {
			traversal.call(this, callback);
		};
		$scope.findIndex = function(arr, data) {
			var index;

			for (var i = 0; i < arr.length; i++) {
				if (arr[i].id === data) {
					index = i;
				}
			}

			return index;
		}
		//Adding a node. Traverse through the information with the callback that compares id. When we have a parent whose id is the target, we push them a child.
		$scope.Tree.prototype.add = function(data, toData, traversal) {
			var child = new $scope.Node(data),
				parent = null,
				callback = function(node) {
					if (node.id === toData) {
						parent = node;
					}
				};

			this.contains(callback, traversal);

			if (parent) {
				parent.children.push(child);
				child.parent = parent;
				this.checkParents(child);
			} else {
				throw new Error('Cannot add node to a non-existent parent.');
			}
		};
		//Similar to add, search through the tree for the parent id, and remove the selected child from it. 
		$scope.Tree.prototype.remove = function(data, fromData) {
			var tree = this,
				parent = null,
				childToRemove = null,
				index;
		

			var callback = function(node) {
				if (node.id === fromData) {
					parent = node;
				}
			};
			if (data != 1) {
				this.contains(callback, this.traverseBF);

				if (parent) {
					index = $scope.findIndex(parent.children, data);

					if (index === undefined) {
						throw new Error('Node to remove does not exist.');
					} else {
						childToRemove = parent.children.splice(index, 1);
					}
				} else {
					throw new Error('Parent does not exist.');
				}
			}
			else {
				throw new Error('Cant remove root');
			}
			return childToRemove;
		};
		//Marks a node complete then calls for their children to also be complete
		$scope.Tree.prototype.complete = function(data) {
			var tree = this,
				parent = null, 
				callback = function(node) {
					if (node.id == data) {
						parent = node;
					}
				};

			this.contains(callback, this.traverseBF);

			if (parent) {
				index = $scope.findIndex(parent.children, data);
				this.completeChildren(parent);
				$scope.$apply;
			} else {
				throw new Error('Parent does not exist.');
			}
		}
		$scope.addTaskTo = function(id, task) {
			$scope.treeM.add(task, id, $scope.treeM.traverseBF);
		}
		$scope.treeM = new $scope.Tree("To-Do:");

		
		$('body').on('click', 'li', function() {
			$('.hidden').hide();
			$(this).children('.hidden').show();
		});
	}]);
})()