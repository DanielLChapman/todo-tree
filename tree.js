var counter = 0;
var code = "";
var tree = new Tree("To-Do:");
//every node contains a task, id (need a better unique system), parent, and children. Boolean for completed tasks or if the bool can be removed (root)
function Node(task) {
	this.task = task;
	counter++;
	this.id = counter;
	this.parent = 0;
	this.children = [];
	this.complete = false;
	this.boolRemoved = true;
}
//Tree data,setting up root and nodes
function Tree(data) {
	var node = new Node(data);
	this._root = node;
	this._root.boolRemoved = false;
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
//Traverses the tree line by line. So Root ->first node -> first child -> and children and repeat, then moves onto the next child. Moves up, next child. So on and so on.
//Also generates the display code which holds information about the tree
Tree.prototype.traverseLine = function(callback) {
	var queue = [];
	code += "<ul>";
	currentNode = this._root;
	(function recurse(currentNode) {
		if (currentNode.complete) {
			code += "<li style='color: green;' >";
		} 
		else {
			code += "<li style='color: red;'>";
		}
		code += "<i class='fa fa-check checkmark' parent='"+currentNode.parent.id+"' id='"+currentNode.id+"' task='"+currentNode.task+"'style='cursor: pointer;' aria-hidden='true'></i>"
		code += currentNode.task;
		queue.push(currentNode);
		code += "</span>   <span class='hidden'>&nbsp;   <input type='text' name='fname' class='new-task-field-"+currentNode.id+"'>     <button type='button' class='node-button'>Add Task</button>";
		if (currentNode.boolRemoved) {
			code+="     <i class='fa fa-times removal' aria-hidden='true' style='color: red !important; cursor: pointer;'></i>";
		}
		code+="</span></li>";
		callback(currentNode);
		code += "<ul>";
		for (var i = 0; i < currentNode.children.length; i++) {
			recurse(currentNode.children[i]);
		}
		code += "</ul>";
	})(currentNode)
	code += "</ul>";
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
//Calls traversal searches with callback instead of only going with one traversal. 
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
	
	if (parent) {
		parent.children.push(child);
		child.parent = parent;
		tree.checkParents(child);
	} else {
		throw new Error('Cannot add node to a non-existent parent.');
	}
};
//Similar to add, search through the tree for the parent id, and remove the selected child from it. 
Tree.prototype.remove = function(data, fromData, traversal) {
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
		this.contains(callback, traversal);

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
//Marks a node complete then calls for their children to also be complete
Tree.prototype.complete = function(data, traversal) {
	var tree = this,
		parent = null, 
		callback = function(node) {
			if (node.id == data) {
				parent = node;
			}
		};
	
	this.contains(callback, traversal);
	
	if (parent) {
		index = findIndex(parent.children, data);
		this.completeChildren(parent);
		
	} else {
		throw new Error('Parent does not exist.');
	}
}
