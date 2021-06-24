$(document).ready(function() {
    let edit = false;
    $('#task-result').hide();
    // Mandamos a llamar a la función de obtener tareas
    fetchTasks();
    // Función para buscar una tarea
    $('#search').keyup(function(e) {
        if ($('#search').val()) {
            let search = $('#search').val();
            $.ajax({
                url: 'task-search.php',
                data: { search },
                type: 'POST',
                success: function(response) {
                    let tasks = JSON.parse(response);
                    let template = '';
                    tasks.forEach(task => {
                        template += `<li>
                            ${task.name}
                        </li>`
                    });

                    $('#container').html(template);
                    $('#task-result').show();
                }
            });
        } else {
            $('#task-result').hide();
        }
    });
    // Función para agregar una tarea
    $('#task-form').submit(function(e) {
        e.preventDefault();
        const postData = {
            name: $('#name').val(),
            description: $('#description').val(),
            id: $('#taskId').val()
        };
        let url = edit === false ? 'task-add.php' : 'task-edit.php';
        console.log(url);

        $.post(url, postData, function(response) {
            console.log(response);
            $('#task-form').trigger('reset');
            fetchTasks();
        });

    });
    // Función para listar las tareas de la base de datos
    function fetchTasks() {
        $.ajax({
            url: 'task-list.php',
            type: 'GET',
            success: function(response) {
                let tasks = JSON.parse(response);
                let template = '';
                tasks.forEach(task => {
                    template += `
                        <tr taskId="${task.id}">
                            <td>${task.id}</td>
                            <td><a href="" class="taskItem">${task.name}</a></td>
                            <td>${task.description}</td>
                            <td><button class="task-delete btn btn-danger">Delete</button></td>
                        </tr>
                    `;
                });
                $('#tasks').html(template);
            }
        });
    }

    $(document).on('click', '.task-delete', function() {
        if (confirm('Are you sure you want to delete this task?')) {
            let element = $(this)[0].parentElement.parentElement;
            let id = $(element).attr('taskId');
            $.post('task-delete.php', { id }, function(response) {
                fetchTasks();
            });
        }
    });

    $(document).on('click', '.taskItem', function(e) {
        e.preventDefault();
        let element = $(this)[0].parentElement.parentElement;
        let id = $(element).attr('taskId');
        $.post('task-single.php', { id }, function(response) {
            const task = JSON.parse(response);
            $('#name').val(task.name);
            $('#description').val(task.description);
            $('#taskId').val(task.id);
            edit = true;
        });
    });

});