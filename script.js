const todoList = document.getElementById('todo-list');
const doingList = document.getElementById('doing-list');
const completedList = document.getElementById('completed-list');
const inputTodo = document.getElementById('input-todo');
const checkboxes = document.getElementsByClassName('todo-list-checkbox');
const modal = document.getElementById('todo-modal');
const modalHeader = document.getElementById('modal-header');
const closeBtn = document.getElementById('close-modal');
const editDescriptionBtn = document.getElementById('edit-description');
const saveDescriptionBtn = document.getElementById('save-description');
const cancelEditDescription = document.getElementById('cancel-edit-description');
const inputDescription = document.getElementById('input-description');
const taskDescription = document.getElementById('task-description');
const deleteTaskBtn = document.getElementById('delete-task');
const inputEditTask = document.getElementById('input-edit-task');
const checklistBtn = document.getElementById('checklist-btn');
const checklistForm = document.getElementById('checklist-form');
const addChecklistBtn = document.getElementById('add-checklist-btn');
const updateChecklistBtn = document.getElementById('update-checklist-btn');
const deleteChecklistBtn = document.getElementById('delete-checklist-btn');
const checklistTitle = document.getElementById('checklist-title');
const addChecklisItemBtn = document.getElementById('add-checklist-item-btn');
const checklistList = document.getElementById('checklist-list');
const checklistItemForm = document.getElementById('checklist-item-form');
const saveChecklistItemBtn = document.getElementById('save-checklist-item-btn');
const closeChecklistItemBtn = document.getElementById('close-checklist-item-btn');
let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
let doing = localStorage.getItem('doing') ? JSON.parse(localStorage.getItem('doing')) : [];
let completed = localStorage.getItem('completed') ? JSON.parse(localStorage.getItem('completed')) : [];
let counter = localStorage.getItem('counter') ? localStorage.getItem('counter') : localStorage.setItem('counter', '0');
let options = [];
let checkItems;

const openModal = () => {
	modal.style.display = 'block';
	document.getElementsByTagName('body')[0].style.overflow = 'hidden';
};

const closeModal = () => {
	modal.style.display = 'none';
	document.getElementsByTagName('body')[0].removeAttribute('style');
	const id = document.getElementById('task-id');
	const type = document.getElementById('task-type');
	if (id && type) {
		let el = '';
		switch (type) {
			case 'todo':
				el = findIndex(todos, +id);
				break;
			case 'doing':
				el = findIndex(doing, +id);
				break;
			case 'completed':
				el = findIndex(completed, +id);
				break;
		}
		const desc = el.description ? el.description : 'There is no description';
		taskDescription.innerHTML = desc;
		checkItems = [];
	}

	checklistForm.classList.remove('show');
	saveDescriptionBtn.classList.add('hide');
	cancelEditDescription.classList.add('hide');
	editDescriptionBtn.classList.remove('hide');
	inputDescription.parentElement.classList.add('hide');
	taskDescription.classList.remove('hide');
	inputEditTask.classList.add('hide');
	modalHeader.classList.remove('hide');
	checklistItemForm.classList.add('hide');
};

const outsideClick = (e) => {
	if (e.target == modal) {
		closeModal();
	}
};

const render = (array, type) => {
	let contentTable = '';
	if (!array.length) {
		switch (type) {
			case 'todo':
				contentTable += '<div class="todo-item">';
				contentTable += `You don't have task in Todo-List`;
				contentTable += '</div>';
				break;
			case 'doing':
				contentTable += '<div class="doing-item">';
				contentTable += `You don't have task in Doing Section`;
				contentTable += '</div>';
				break;
			case 'completed':
				contentTable += '<div class="completed-item">';
				contentTable += `You don't have completed task`;
				contentTable += '</div>';
				break;
		}
	}

	for (let i = 0; i < array.length; i++) {
		contentTable +=
			'<div id="' +
			type +
			'-item-' +
			array[i].id +
			'" class="' +
			type +
			'-item" onclick="edit(event,' +
			array[i].id +
			',' +
			`'${type}'` +
			')" draggable="true" ondragstart="event.dataTransfer.setData(`text/plain`,null)">';
		contentTable += '<div class="' + type + '-item--detail">';

		if (type === 'completed') {
			if (array[i].description) {
				contentTable += '<div id="' + type + '-name-' + array[i].id + '" class="' + type + '-name">';
				contentTable += '<i class="fa badge fa-certificate" aria-hidden="true"></i>&nbsp';
				contentTable += array[i].name;
				contentTable += '<br><i class="fa fa-list" aria-hidden="true"></i>';
				contentTable += '</div>';
			} else {
				contentTable += '<div id="' + type + '-name-' + array[i].id + '" class="' + type + '-name">';
				contentTable += '<i class="fa badge fa-certificate" aria-hidden="true"></i>&nbsp';
				contentTable += array[i].name;
				contentTable += '</div>';
			}
		} else {
			if (array[i].description) {
				contentTable += array[i].name + '<br><i class="fa fa-list" aria-hidden="true"></i>';
			} else {
				contentTable += array[i].name;
			}
		}
		contentTable += '</div>';
		contentTable += '</div>';
	}

	switch (type) {
		case 'todo':
			todoList.innerHTML = contentTable;
			break;
		case 'doing':
			doingList.innerHTML = contentTable;
			break;
		case 'completed':
			completedList.innerHTML = contentTable;
			break;
	}
};

const setLocalStorageAndRender = (type, isRender) => {
	if (type === 'todo') {
		localStorage.setItem('todos', JSON.stringify(todos));
		if (isRender) {
			render(todos, 'todo');
		}
	}

	if (type === 'doing') {
		localStorage.setItem('doing', JSON.stringify(doing));
		if (isRender) {
			render(doing, 'doing');
		}
	}

	if (type === 'completed') {
		localStorage.setItem('completed', JSON.stringify(completed));
		if (isRender) {
			render(completed, 'completed');
		}
	}
};

const clearTodos = (arr) => {
	const result = [];
	for (const todo of todos) {
		const index = arr.indexOf(todo.id);
		if (index === -1) {
			result.push(todo);
		}
	}
	return result;
};

const clearDoing = (arr) => {
	const result = [];
	for (const d of doing) {
		const index = arr.indexOf(d.id);
		if (index === -1) {
			result.push(d);
		}
	}
	return result;
};

const markAsDoing = (arr) => {
	for (const todo of todos) {
		const index = arr.indexOf(todo.id);
		if (index !== -1) {
			doing.push(todo);
		}
	}
	return doing;
};

const markAsCompleted = (arr) => {
	for (const d of doing) {
		const index = arr.indexOf(d.id);
		if (index !== -1) {
			completed.push(d);
		}
	}
	return completed;
};

const checkTodo = (event) => {
	if (event.checked) {
		options.push(+event.value);
	} else {
		const index = options.indexOf(+event.value);
		options.splice(index, 1);
	}
};

const removeTodo = (options, array) => {
	const result = [];
	for (const el of array) {
		const index = options.indexOf(el.id);
		if (index === -1) {
			result.push(el);
		}
	}
	return result;
};

const addTodo = (options, from, to) => {
	for (const d of from) {
		const index = options.indexOf(d.id);
		if (index !== -1) {
			to.push(d);
		}
	}
	return to;
};

const edit = (event, id, type) => {
	checkItems = [];
	openModal();
	document.getElementById('task-id').value = id;
	document.getElementById('task-type').value = type;
	modalHeader.innerText = event.target.innerText;
	let el = getElementByIdAndType(id, type);
	const desc = el.description ? el.description.replace(/(?:\r\n|\r|\n)/g, '<br>') : 'There is no description';
	taskDescription.innerHTML = desc;
	if (el.checklist) {
		checklistTitle.children[0].innerHTML =
			'<i class="fa fa-list-alt" aria-hidden="true"></i>&nbsp;' + el.checklist.title;
		let list = el.checklist.list;
		checklistList.innerHTML = generateChecklisItem(list);
		addChecklisItemBtn.classList.remove('hide');
		el.checklist.list.length
			? checklistTitle.children[1].classList.remove('hide')
			: checklistTitle.children[1].classList.add('hide');
	} else {
		checklistTitle.children[0].innerHTML = '';
		checklistTitle.children[1].classList.add('hide');
		checklistList.innerHTML = '';
		addChecklisItemBtn.classList.add('hide');
	}
};

const moveTask = (arrFrom, arrTo, ids, targetId) => {
	if (targetId) {
		const targetIndex = arrTo.list.findIndex((d) => d.id === +targetId);
		const index = arrFrom.list.findIndex((t) => t.id === +ids);
		arrTo.list.splice(targetIndex + 1, 0, arrFrom.list[index]);
		arrFrom.list.splice(index, 1);
	} else {
		if (ids.length === 1) {
			let id = ids[0];
			const index = arrFrom.list.findIndex((e) => e.id === id);
			arrTo.list.push(arrFrom.list[index]);
			arrFrom.list.splice(index, 1);
		}
	}

	if (arrFrom.name === 'todo' || arrTo.name === 'todo') {
		localStorage.setItem('todos', JSON.stringify(todos));
		render(todos, 'todo');
	}
	if (arrFrom.name === 'doing' || arrTo.name === 'doing') {
		localStorage.setItem('doing', JSON.stringify(doing));
		render(doing, 'doing');
	}
	if (arrFrom.name === 'completed' || arrTo.name === 'completed') {
		localStorage.setItem('completed', JSON.stringify(completed));
		render(completed, 'completed');
	}
};

const shiftTask = (from, to, arr) => {
	from = arr.list.findIndex((a) => a.id === from);
	if (to) {
		to = arr.list.findIndex((a) => a.id === to);
		let temp = arr.list[to];
		arr.list[to] = arr.list[from];
		arr.list[from] = temp;
	} else {
		const item = arr.list[from];
		arr.list.splice(from, 1);
		arr.list.push(item);
	}

	setLocalStorageAndRender(arr.name, true);
};

const getTargetId = (targetId) => {
	targetId = targetId.split('-');
	targetId = targetId[targetId.length - 1];
	return targetId;
};

const findEl = (arr, id) => {
	const index = arr.findIndex((a) => a.id === +id);
	return arr[index];
};

const checkItem = (e, el) => {
	if (e.target.checked) {
		checkItems.push(el);
	} else {
		const index = checkItems.findIndex((e) => e === el);
		checkItems.splice(index, 1);
	}
};

const openFormEditCheckItemName = (e, id) => {
	e.preventDefault();
	document.getElementById('form-check-item-name-' + id).classList.remove('hide');
	e.target.classList.add('hide');
};

const editCheckItemName = (e, itemId) => {
	e.preventDefault();
	const id = document.getElementById('task-id').value;
	const type = document.getElementById('task-type').value;
	const value = document.getElementById('input-edit-check-item-name-' + itemId).value;
	let el = getElementByIdAndType(id, type);
	let list = el.checklist.list;
	const index = list.findIndex((e) => e.id === +itemId);
	list[index].text = value;
	setLocalStorageAndRender(type, false);
	const form = document.getElementById('form-check-item-name-' + itemId);
	form.previousElementSibling.classList.remove('hide');
	form.classList.add('hide');
	form.previousElementSibling.innerHTML = value;
};

const cancelCheckItemName = (e, itemId) => {
	e.preventDefault();
	const id = document.getElementById('task-id').value;
	const type = document.getElementById('task-type').value;
	const value = document.getElementById('input-edit-check-item-name-' + itemId).value;
	let el = getElementByIdAndType(id, type);
	let list = el.checklist.list;
	const index = list.findIndex((e) => e.id === +itemId);
	const form = document.getElementById('form-check-item-name-' + itemId);
	form.previousElementSibling.classList.remove('hide');
	form.classList.add('hide');
	form.previousElementSibling.innerHTML = list[index].text;
	document.getElementById('input-edit-check-item-name-' + itemId).value = list[index].text;
};

const generateChecklisItem = (array) => {
	let content = '';
	for (let i = 0; i < array.length; i++) {
		content += '<div style="position:relative;min-height:35px;display:flex;">';
		content += '<label class="label-checkbox">';
		content +=
			'<input onchange="checkItem(event, ' +
			array[i].id +
			')" value="' +
			array[i].id +
			'" type="checkbox" class="filled-in"/>';
		content += '<span class="checkmark"></span>';
		content += '</label>';
		content +=
			'<span style="cursor:pointer;" onclick="openFormEditCheckItemName(event, ' +
			array[i].id +
			')" class="check-item-name">';
		content += array[i].text;
		content += '</span>';
		content += '<form style="width:80%;" class="hide" id="form-check-item-name-' + array[i].id + '">';
		content +=
			'<textarea id="input-edit-check-item-name-' +
			array[i].id +
			'" class="form-control">' +
			array[i].text +
			'</textarea>';
		content += '<div style="display:flex;margin-top:10px;">';
		content +=
			'<button onclick="editCheckItemName(event, ' +
			array[i].id +
			')" class="btn btn-success" style="margin-right:10px;">Edit</button>';
		content +=
			'<button onclick="cancelCheckItemName(event, ' +
			array[i].id +
			')" class="btn btn-default">&times;</button>';
		content += '</div>';
		content += '</form>';
		content += '</div>';
	}
	return content;
};

const getElementByIdAndType = (id, type) => {
	let item = '';
	switch (type) {
		case 'todo':
			index = todos.findIndex((t) => t.id === +id);
			item = todos[index];
			break;
		case 'doing':
			index = doing.findIndex((t) => t.id === +id);
			item = doing[index];
			break;
		case 'completed':
			index = completed.findIndex((t) => t.id === +id);
			item = completed[index];
			break;
	}
	return item;
};

render(todos, 'todo');
render(doing, 'doing');
render(completed, 'completed');

inputTodo.addEventListener('keyup', (e) => {
	e.preventDefault();

	counter = localStorage.getItem('counter');
	if (typeof counter === 'string') {
		counter = +counter;
	}
	counter = +counter;

	if (e.keyCode === 13) {
		const value = inputTodo.value;
		let todo = {
			id: counter,
			name: value.trim()
		};
		todos.push(todo);
		localStorage.setItem('todos', JSON.stringify(todos));
		counter++;
		localStorage.setItem('counter', counter.toString());
		inputTodo.value = '';
		render(todos, 'todo');
	}
});

let dragged;
document.addEventListener('drag', (event) => {}, false);
document.addEventListener(
	'dragstart',
	(event) => {
		dragged = event.target;
		event.target.style.backgroundColor = '#ccc';
	},
	false
);

document.addEventListener(
	'dragend',
	(event) => {
		event.target.style.backgroundColor = '';
	},
	false
);

document.addEventListener('dragover', (event) => {
	event.preventDefault();
});

document.addEventListener('drop', (event) => {
	event.preventDefault();
	let elClass = dragged.getAttribute('class');
	let id = dragged.getAttribute('id');
	id = id.split('-');
	id = id[id.length - 1];
	id = +id;
	let target = event.target;
	let objTodos = {
		name: 'todo',
		list: todos
	};
	let objDoing = {
		name: 'doing',
		list: doing
	};

	let objCompleted = {
		name: 'completed',
		list: completed
	};
	switch (elClass) {
		case 'todo-item':
			if (target.className === 'doing-list') {
				options = [ id ];
				moveTask(objTodos, objDoing, options);
			}

			if (target.className === 'completed-list') {
				options = [ id ];
				moveTask(objTodos, objCompleted, options);
			}

			if (
				target.className === 'doing-name' ||
				target.className === 'completed-name' ||
				target.className === 'todo-name'
			) {
				target = event.target.parentElement.parentElement;
			}

			if (
				target.className === 'doing-item--detail' ||
				target.className === 'completed-item--detail' ||
				target.className === 'todo-item--detail'
			) {
				target = event.target.parentElement;
			}

			if (target.className === 'doing-item') {
				const target = event.target;
				let targetId = target.getAttribute('id');

				if (targetId) {
					targetId = getTargetId(targetId);
					moveTask(objTodos, objDoing, id, targetId);
				} else {
					options = [ +id ];
					moveTask(objTodos, objDoing, options);
				}
			}

			if (target.className === 'completed-item') {
				const target = event.target;
				let targetId = target.getAttribute('id');
				if (targetId) {
					targetId = getTargetId(targetId);
					moveTask(objTodos, objCompleted, id, targetId);
				} else {
					options = [ +id ];
					moveTask(objTodos, objCompleted, options);
				}
			}

			if (target.className === 'todo-item') {
				let targetId = target.getAttribute('id');
				targetId = getTargetId(targetId);
				shiftTask(+id, +targetId, objTodos);
			}

			if (target.className === 'todo-list') {
				shiftTask(id, undefined, objTodos);
			}

			break;
		case 'doing-item':
			if (target.className === 'todo-list') {
				options = [ +id ];
				moveTask(objDoing, objTodos, options);
			}

			if (target.className === 'completed-list') {
				options = [ id ];
				moveTask(objDoing, objCompleted, options);
			}

			if (
				target.className === 'todo-name' ||
				target.className === 'completed-name' ||
				target.className === 'doing-name'
			) {
				target = event.target.parentElement.parentElement;
			}

			if (
				target.className === 'doing-item--detail' ||
				target.className === 'completed-item--detail' ||
				target.className === 'todo-item--detail'
			) {
				target = event.target.parentElement;
			}

			if (target.className === 'todo-item') {
				const target = event.target;
				let targetId = target.getAttribute('id');
				if (targetId) {
					targetId = getTargetId(targetId);
					moveTask(objDoing, objTodos, id, targetId);
				} else {
					options = [ +id ];
					moveTask(objDoing, objTodos, options);
				}
			}

			if (target.className === 'completed-item') {
				const target = event.target;
				let targetId = target.getAttribute('id');
				if (targetId) {
					targetId = getTargetId(targetId);
					moveTask(objDoing, objCompleted, id, targetId);
				} else {
					options = [ +id ];
					moveTask(objDoing, objCompleted, options);
				}
			}

			if (target.className === 'doing-item') {
				let targetId = target.getAttribute('id');
				targetId = getTargetId(targetId);
				shiftTask(id, +targetId, objDoing);
			}

			if (target.className === 'doing-list') {
				shiftTask(id, undefined, objDoing);
			}

			break;
		case 'completed-item':
			if (target.className === 'todo-list') {
				options = [ +id ];
				moveTask(objCompleted, objTodos, options);
			}

			if (target.className === 'doing-list') {
				options = [ id ];
				moveTask(objCompleted, objDoing, options);
			}

			if (
				target.className === 'todo-name' ||
				target.className === 'doing-name' ||
				target.className === 'completed-name'
			) {
				target = event.target.parentElement.parentElement;
			}

			if (
				target.className === 'doing-item--detail' ||
				target.className === 'completed-item--detail' ||
				target.className === 'todo-item--detail'
			) {
				target = event.target.parentElement;
			}

			if (target.className === 'todo-item') {
				const target = event.target;
				let targetId = target.getAttribute('id');
				if (targetId) {
					targetId = getTargetId(targetId);
					moveTask(objCompleted, objTodos, id, targetId);
				} else {
					options = [ +id ];
					moveTask(objCompleted, objTodos, options);
				}
			}

			if (target.className === 'doing-item') {
				const target = event.target;
				let targetId = target.getAttribute('id');
				if (targetId) {
					targetId = getTargetId(targetId);
					moveTask(objCompleted, objDoing, id, targetId);
				} else {
					options = [ +id ];
					moveTask(objCompleted, objDoing, options);
				}
			}

			if (target.className === 'completed-item') {
				let targetId = target.getAttribute('id');
				targetId = getTargetId(targetId);
				shiftTask(id, +targetId, objCompleted);
			}

			if (target.className === 'completed-list') {
				shiftTask(id, undefined, objCompleted);
			}
			break;
	}
});

closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

editDescriptionBtn.addEventListener('click', (e) => {
	e.preventDefault();
	e.target.classList.add('hide');
	const id = document.getElementById('task-id').value;
	const type = document.getElementById('task-type').value;
	let el = '';
	switch (type) {
		case 'todo':
			el = findEl(todos, id);
			break;
		case 'doing':
			el = findEl(doing, id);
			break;
		case 'completed':
			el = findEl(completed, id);
			break;
	}

	const desc = el.description ? el.description : '';
	inputDescription.value = desc;
	saveDescriptionBtn.classList.remove('hide');
	cancelEditDescription.classList.remove('hide');
	inputDescription.parentElement.classList.remove('hide');
	taskDescription.classList.add('hide');
});

cancelEditDescription.addEventListener('click', (e) => {
	e.preventDefault();
	e.target.classList.add('hide');
	saveDescriptionBtn.classList.add('hide');
	editDescriptionBtn.classList.remove('hide');
	taskDescription.classList.remove('hide');
	inputDescription.parentElement.classList.add('hide');
});

saveDescriptionBtn.addEventListener('click', (e) => {
	e.preventDefault();
	const id = document.getElementById('task-id').value;
	const type = document.getElementById('task-type').value;
	const desc = inputDescription.value;
	let el = getElementByIdAndType(id, type);
	el.description = desc;
	setLocalStorageAndRender(type, true);

	e.target.classList.add('hide');
	editDescriptionBtn.classList.remove('hide');
	inputDescription.parentElement.classList.add('hide');
	cancelEditDescription.classList.add('hide');
	taskDescription.innerHTML = desc ? desc.replace(/(?:\r\n|\r|\n)/g, '<br>') : 'There is no description';
	taskDescription.classList.remove('hide');
});

deleteTaskBtn.addEventListener('click', (e) => {
	e.preventDefault();
	const id = document.getElementById('task-id').value;
	const type = document.getElementById('task-type').value;
	let index = 0;
	switch (type) {
		case 'todo':
			index = todos.findIndex((d) => d.id === +id);
			todos.splice(index, 1);
			break;
		case 'doing':
			index = doing.findIndex((d) => d.id === +id);
			doing.splice(index, 1);
			break;
		case 'completed':
			index = completed.findIndex((d) => d.id === +id);
			completed.splice(index, 1);
			break;
	}

	setLocalStorageAndRender(type, true);

	counter++;
	localStorage.setItem('counter', counter.toString());
	closeModal();
});

modalHeader.addEventListener('click', (e) => {
	e.preventDefault();
	const task = e.target.innerText;
	event.target.classList.add('hide');
	inputEditTask.value = task;
	inputEditTask.classList.remove('hide');
	inputEditTask.focus();
});

inputEditTask.addEventListener('keyup', (e) => {
	e.preventDefault();
	if (e.keyCode === 13) {
		const value = e.target.value;
		const id = document.getElementById('task-id').value;
		const type = document.getElementById('task-type').value;
		let element = getElementByIdAndType(id, type);
		element.name = value;

		setLocalStorageAndRender(type, true);
		e.target.classList.add('hide');
		modalHeader.innerText = value;
		modalHeader.classList.remove('hide');
		counter++;
		localStorage.setItem('counter', counter.toString());
	}
});

inputEditTask.addEventListener('blur', (e) => {
	e.preventDefault();
	modalHeader.classList.remove('hide');
	e.target.classList.add('hide');
});

checklistBtn.addEventListener('click', (e) => {
	checklistForm.classList.toggle('show');
	const id = document.getElementById('task-id').value;
	const type = document.getElementById('task-type').value;
	let el = getElementByIdAndType(id, type);
	let checklistHeading = checklistForm.children[0].children[0];
	let input = document.getElementById('input-checklist-title');
	if (el.checklist) {
		checklistHeading.innerHTML = 'Update Checklist';
		updateChecklistBtn.classList.remove('hide');
		deleteChecklistBtn.classList.remove('hide');
		addChecklistBtn.classList.add('hide');
		input.value = el.checklist.title;
	} else {
		checklistHeading.innerHTML = 'Add Checklist';
		updateChecklistBtn.classList.add('hide');
		deleteChecklistBtn.classList.add('hide');
		addChecklistBtn.classList.remove('hide');
		input.value = '';
	}
	input.focus();
});

addChecklistBtn.addEventListener('click', (e) => {
	e.preventDefault();
	const title = document.getElementById('input-checklist-title').value;
	const id = document.getElementById('task-id').value;
	const type = document.getElementById('task-type').value;
	let obj = {
		title,
		list: []
	};
	let el = getElementByIdAndType(id, type);
	el.checklist = obj;
	setLocalStorageAndRender(type, false);
	checklistForm.classList.remove('show');
	checklistTitle.children[0].innerHTML =
		'<i class="fa fa-list-alt" aria-hidden="true"></i>&nbsp;' + el.checklist.title;
	addChecklisItemBtn.classList.remove('hide');
});

addChecklisItemBtn.addEventListener('click', (e) => {
	e.preventDefault();
	e.target.classList.add('hide');
	checklistItemForm.classList.remove('hide');
});

saveChecklistItemBtn.addEventListener('click', (e) => {
	e.preventDefault();
	const id = document.getElementById('task-id').value;
	const type = document.getElementById('task-type').value;
	let el = getElementByIdAndType(id, type);
	let list = el.checklist.list.sort();
	let counter = list[list.length - 1];
	if (!counter) {
		counter = 0;
	} else {
		counter = counter.id;
	}
	counter++;
	let textarea = checklistItemForm.children[0].children[0];
	let obj = {
		id: counter,
		text: textarea.value
	};
	list.push(obj);
	setLocalStorageAndRender(type, false);
	let items = generateChecklisItem(list);
	checklistList.innerHTML = items;
	textarea.value = '';
	if (list.length) {
		checklistTitle.children[1].classList.remove('hide');
	}
});

closeChecklistItemBtn.addEventListener('click', (e) => {
	e.preventDefault();
	checklistItemForm.classList.add('hide');
	addChecklisItemBtn.classList.remove('hide');
});

checklistTitle.children[1].addEventListener('click', (e) => {
	e.preventDefault();
	const id = document.getElementById('task-id').value;
	const type = document.getElementById('task-type').value;
	let el = getElementByIdAndType(id, type);
	let list = el.checklist.list;
	const result = [];
	for (const e of list) {
		const index = checkItems.findIndex((el) => el === e.id);
		if (index === -1) {
			result.push(e);
		}
	}
	el.checklist.list = result;
	setLocalStorageAndRender(type, false);
	checklistList.innerHTML = generateChecklisItem(result);
	if (!result.length) {
		checklistTitle.children[1].classList.add('hide');
	}
	checkItems = [];
});

updateChecklistBtn.addEventListener('click', (e) => {
	e.preventDefault();
	const id = document.getElementById('task-id').value;
	const type = document.getElementById('task-type').value;
	const input = document.getElementById('input-checklist-title').value;
	let el = getElementByIdAndType(id, type);
	el.checklist.title = input;
	setLocalStorageAndRender(type, false);
	checklistForm.classList.remove('show');
	checklistTitle.children[0].innerHTML = '<i class="fa fa-list-alt" aria-hidden="true"></i>&nbsp;' + input;
});

deleteChecklistBtn.addEventListener('click', (e) => {
	e.preventDefault();
	const id = document.getElementById('task-id').value;
	const type = document.getElementById('task-type').value;
	let el = getElementByIdAndType(id, type);
	delete el.checklist;
	setLocalStorageAndRender(type, false);
	checklistForm.classList.remove('show');
	checklistTitle.children[0].innerHTML = '';
	checklistTitle.children[1].classList.add('hide');
	checklistList.innerHTML = '';
	addChecklisItemBtn.classList.remove('show');
	addChecklisItemBtn.classList.add('hide');
});
