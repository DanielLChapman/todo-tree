/*
//Mark complete
$('body').on('click', '.checkmark', function() {
	tree.complete($(this).attr('id'), tree.traverseBF);
	render();
});
//Adding a new task
$('body').on('click','.node-button', function() {
	var data = $(this).parent().children('input').val();
	var parentID = $(this).parent().parent().children('i').attr('id');
	tree.add(data, parseInt(parentID), tree.traverseBF);
	render();
});
//Removal from X click.
$('body').on('click','.removal', function() {
	var childID = parseInt($(this).parent().parent().children('i').attr('id'));
	var parentID = parseInt($(this).parent().parent().children('i').attr('parent'));
	tree.remove(childID, parentID, tree.traverseBF);
	render();
});
//Displaying the input and removal buttons when the li is clicked
$('body').on('click', 'li', function() {
	$('.hidden').hide();
	$(this).children('.hidden').show();
});*/