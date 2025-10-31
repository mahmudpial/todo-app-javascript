
        (function () {
            const input = document.getElementById('todo-input');
            const addBtn = document.getElementById('add-btn');
            const listEl = document.getElementById('todo-list');
            const countEl = document.getElementById('items-count');
            const clearCompletedBtn = document.getElementById('clear-completed');
            const clearAllBtn = document.getElementById('clear-all');
            const modal = document.getElementById('modal');
            const modalInput = document.getElementById('modal-input');
            const modalTitle = document.getElementById('modal-title');
            const saveBtn = document.getElementById('save-btn');
            const closeBtn = document.getElementById('close-btn');

            let todos = JSON.parse(localStorage.getItem('todos_v2') || '[]');
            let currentTodo = null;

            function save() {
                localStorage.setItem('todos_v2', JSON.stringify(todos));
            }

            function render() {
                listEl.innerHTML = '';
                if (todos.length === 0) {
                    const empty = document.createElement('li');
                    empty.className = 'muted';
                    empty.textContent = 'No todos yet — add one above!';
                    listEl.appendChild(empty);
                }

                todos.forEach(todo => {
                    const li = document.createElement('li');
                    li.className = 'todo-item' + (todo.done ? ' completed' : '');

                    const chk = document.createElement('input');
                    chk.type = 'checkbox';
                    chk.checked = !!todo.done;
                    chk.addEventListener('change', () => {
                        todo.done = chk.checked;
                        save();
                        render();
                    });

                    const span = document.createElement('div');
                    span.className = 'todo-text';
                    span.textContent = todo.text;

                    const viewBtn = document.createElement('button');
                    viewBtn.className = 'btn-view';
                    viewBtn.textContent = '👁';
                    viewBtn.title = 'View Todo';
                    viewBtn.addEventListener('click', () => openModal(todo, false));

                    const editBtn = document.createElement('button');
                    editBtn.className = 'btn-edit';
                    editBtn.textContent = '✎';
                    editBtn.title = 'Edit Todo';
                    editBtn.addEventListener('click', () => openModal(todo, true));

                    const delBtn = document.createElement('button');
                    delBtn.className = 'btn-delete';
                    delBtn.textContent = '✕';
                    delBtn.title = 'Delete Todo';
                    delBtn.addEventListener('click', () => {
                        todos = todos.filter(t => t.id !== todo.id);
                        save();
                        render();
                    });

                    li.append(chk, span, viewBtn, editBtn, delBtn);
                    listEl.appendChild(li);
                });

                const remaining = todos.filter(t => !t.done).length;
                countEl.textContent = remaining + (remaining === 1 ? ' item left' : ' items left');
            }

            function addTodo(text) {
                const trimmed = text && text.trim();
                if (!trimmed) return;
                const todo = { id: Date.now() + Math.random().toString(36).slice(2, 8), text: trimmed, done: false };
                todos.unshift(todo);
                save();
                render();
            }

            function openModal(todo, editable) {
                currentTodo = todo;
                modal.classList.add('active');
                modalTitle.textContent = editable ? 'Edit Todo' : 'View Todo';
                modalInput.value = todo.text;
                modalInput.readOnly = !editable;
                saveBtn.style.display = editable ? 'inline-block' : 'none';
            }

            function closeModal() {
                modal.classList.remove('active');
                currentTodo = null;
            }

            addBtn.addEventListener('click', () => { addTodo(input.value); input.value = ''; });
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { addTodo(input.value); input.value = ''; } });

            saveBtn.addEventListener('click', () => {
                if (!currentTodo) return;
                currentTodo.text = modalInput.value.trim();
                save();
                render();
                closeModal();
            });

            closeBtn.addEventListener('click', closeModal);

            clearCompletedBtn.addEventListener('click', () => {
                todos = todos.filter(t => !t.done);
                save(); render();
            });

            clearAllBtn.addEventListener('click', () => {
                if (!confirm('Are you sure you want to remove all todos?')) return;
                todos = [];
                save(); render();
            });

            render();
        })();
