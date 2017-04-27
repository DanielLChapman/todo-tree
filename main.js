//returns the index of the data in the arr (child in the parents children)
function findIndex(arr, data) {
    var index;
 
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === data) {
            index = i;
        }
    }
 
    return index;
}
//re-draws the traverseLine code and puts it in the box
var render = function() {
	code = "";
	tree.traverseLine(function(node) {
	});
	$('.tree-box').html(code);
}
//new task from the main bar
var newTask = function(data) {
	tree.add(data, tree._root.id, tree.traverseBF);
	render();
}
//sets up the display with the one task
$(document).ready(function() {
	render();
});