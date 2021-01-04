(function() {
	
	var app = angular.module('todoTree', ['ui.router']);
	
	app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

	  $stateProvider
		.state('home', {
		  url: '/home',
		  templateUrl: '/home.html',
		  controller: 'MainCtrl'
		});

	  $urlRouterProvider.otherwise('home');
	}]);

	app.factory('tree', [function() {
		var counter = 0;
		var Node = function(task) {
			this.task = task;
			counter++;
			this.id = counter;
			this.parent = 0;
			this.children = [];
			this.complete = false;
			this.newTask = ""
			this.boolRemoved = true;
		}
		var Tree = function(data) {
			var nodeM = new Node(data);
			this._root = nodeM;
		}
		
		//Depth-first search
		Tree.prototype.traverseDF = function(callback) {

			(function recurse(currentNode) {
				for (var i = 0; i < currentNode.children.length; i++) {
					recurse(currentNode.children[i]);
				}
				callback(currentNode);
			})(this._root)
		}

		//breadth-first search with an array instead of a queue
		Tree.prototype.traverseBF = function(callback) {
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
		Tree.prototype.completeChildren = function(node) {
			(function recurse(currentNode) {
				currentNode.complete = true;
				for (var i = 0; i < currentNode.children.length; i++) {
					recurse(currentNode.children[i]);
				}
			})(node);
		};
		//If the parents are complete but a new task is added, then the parents are no longer complete. This searches upwards.
		Tree.prototype.checkParents = function(node) {
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
		Tree.prototype.contains = function(callback, traversal) {
			traversal.call(this, callback);
		};
		//Adding a node. Traverse through the information with the callback that compares id. When we have a parent whose id is the target, we push them a child.
		Tree.prototype.add = function(data, toData, traversal) {
			var child = new Node(data),
				parent = null,
				callback = function(node) {
					if (node.id === toData) {
						parent = node;
					}
				};

			this.contains(callback, traversal);

			if (typeof child.task === "undefined" || child.task === '') {
				//throw new Error('Cant be empty');
				//uglifys console
				return ;
			}

			if (parent) {
				parent.children.push(child);
				child.parent = parent;
				this.checkParents(child);
			} else {
				throw new Error('Cannot add node to a non-existent parent.');
			}
		};
		//Similar to add, search through the tree for the parent id, and remove the selected child from it. 
		Tree.prototype.remove = function(data, fromData) {
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
		var findIndex = function(arr, data) {
			var index;

			for (var i = 0; i < arr.length; i++) {
				if (arr[i].id === data) {
					index = i;
				}
			}

			return index;
		}

		//Marks a node complete then calls for their children to also be complete
		Tree.prototype.complete = function(data) {
			var tree = this,
				parent = null, 
				callback = function(node) {
					if (node.id == data) {
						parent = node;
					}
				};

			this.contains(callback, this.traverseBF);

			if (parent && parent.complete) {
				return parent.complete = false;
			}

			if (parent) {
				index = findIndex(parent.children, data);
				this.completeChildren(parent);
			} else {
				throw new Error('Parent does not exist.');
			}
		}

		
		Tree.prototype.remove = function(data, fromData) {
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
					index = findIndex(parent.children, data);

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

		Tree.prototype.moveUp = function(data) {
			var tree = this,
				currentNode = null,
				parent = null,
				callback = function(node) {
					if (node.id == data) {
						if (node.parent) {
							currentNode = node;
							parent = node.parent;
						} else {
							throw new Error('cant move root');
						}
						
					}
				};

			this.contains(callback, this.traverseBF);

			let children = parent.children;

			if (children.length <= 1) {
				return null;
			}
			else if (children[0] === currentNode) {
				return null;
			}

			for (var x = 0; x < children.length; x++) {
				if (children[x] === currentNode) {
					let tempNode = children[x-1];
					children[x-1] = children[x];
					children[x] = tempNode;
				}
			}
		}

		Tree.prototype.moveDown = function(data) {
			var tree = this,
				currentNode = null,
				parent = null,
				callback = function(node) {
					if (node.id == data) {
						if (node.parent) {
							currentNode = node;
							parent = node.parent;
						} else {
							throw new Error('cant move root');
						}
						
					}
				};

			this.contains(callback, this.traverseBF);

			let children = parent.children;

			if (children.length <= 1) {
				return null;
			}
			else if (children[children.length - 1] === currentNode) {
				return null;
			}

			for (var x = 0; x < children.length-1; x++) {

				if (children[x] === currentNode) {
					let y = x + 1;
					let tempNode = children[x];
					children[x] = children[y];
					children[y] = tempNode;
					return ;
				}
			}
		}
		
		var treeM = new Tree("To-Do:");
		return treeM;
	}])

	app.controller('MainCtrl', [ '$scope', 'tree', function($scope, tree){
		$scope.test = function(data) {
			console.log(data);
		}
		$scope.tree = tree;
		
		$scope.complete = function(id) {
			$scope.tree.complete(id);
		}

		$scope.removeFrom = function(id, parentId) {
			$scope.tree.remove(id, parentId);
		}
		
		$scope.addTaskTo = function(id, task) {
			$scope.tree.add(task, id, $scope.tree.traverseBF);
		}

		$scope.moveUp = function(id) {
			$scope.tree.moveUp(id);
		}

		$scope.moveDown = function(id) {
			$scope.tree.moveDown(id);
		}
		
		$('body').on('click', 'li', function() {
			$('.hidden').hide();
			$('.active-submit').removeClass('active-submit');
			$(this).children('.hidden').show();
			$(this).children('.hidden').children('button').addClass('active-submit');
		});
	}]);
})()


$('body').click(function(event) {
	if (!event.target.classList.contains('input-task')) {
		$('.hidden').hide();
		$('.active-submit').removeClass('active-submit');
		$('.header-button').addClass('active-submit');
	}
});

window.addEventListener("keyup", function (event) {
	if (event.defaultPrevented) {
	  return; // Do nothing if the event was already processed
	}


	if(event.key == "Enter") {
		document.querySelector('.active-submit').click();
	}

}, true);
