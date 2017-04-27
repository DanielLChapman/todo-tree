var counter = 0;
var code = "";
var tree = new Tree("To-Do:");
//every node contains a task, id (need a better unique system), parent, and children
function Node(task) {
	this.task = task;
	counter++;
	this.id = counter;
	this.parent = 0;
	this.children = [];
	this.complete = false;
	this.boolRemoved = true;
}
function findIndex(arr, data) {
    var index;
 
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === data) {
            index = i;
        }
    }
 
    return index;
}
function Tree(data) {
	var node = new Node(data);
	this._root = node;
	this._root.boolRemoved = false;
}

Tree.prototype.traverseDF = function(callback) {

	(function recurse(currentNode) {
		for (var i = 0; i < currentNode.children.length; i++) {
			recurse(currentNode.children[i]);
		}
		
		callback(currentNode);
		
	})(this._root)
}
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
			code+="     <i class='fa fa-times removal' aria-hidden='true' style='color: red !important'></i>";
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

Tree.prototype.completeChildren = function(node) {
	(function recurse(currentNode) {
		currentNode.complete = true;
		for (var i = 0; i < currentNode.children.length; i++) {
			recurse(currentNode.children[i]);
		}
	})(node);
}


Tree.prototype.contains = function(callback, traversal) {
    traversal.call(this, callback);
};

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
		parent.complete = false;
		tree._root.complete = false;
		child.parent = parent;
	} else {
		throw new Error('Cannot add node to a non-existent parent.');
	}
};
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
var render = function() {
	code = "";
	tree.traverseLine(function(node) {
	});
	$('.tree-box').html(code);
}
var newTask = function(data) {
	tree.add(data, tree._root.id, tree.traverseBF);
	render();
}
$('body').on('click', '.checkmark', function() {
	tree.complete($(this).attr('id'), tree.traverseBF);
	render();
});
$('body').on('click','.node-button', function() {
	var data = $(this).parent().children('input').val();
	var parentID = $(this).parent().parent().children('i').attr('id');
	tree.add(data, parseInt(parentID), tree.traverseBF);
	render();
});
$('body').on('click','.removal', function() {
	tree.remove(parseInt($(this).parent().children('i').attr('id')), parseInt($(this).parent().parent().children('i').attr('parent')), tree.traverseBF);
	render();
});
$('body').on('click', 'li', function() {
	$('.hidden').hide();
	$(this).children('.hidden').show();
});
$(document).ready(function() {

	render();
	/*console.log("Contains");
	tree.contains(function(node) {
		var tempArr = node.task.split('-');
		for (var x = 0; x < tempArr.length; x++) {
			if (tempArr[x].toLowerCase() === 'one' ) {
				console.log(node);
			}
		}
	}, tree.traverseBF);
	tree.remove('Three', 'One', tree.traverseBF);
	tree.traverseDF(function(node) {
		console.log(node.task  + " " + node.id);
	});*/
});