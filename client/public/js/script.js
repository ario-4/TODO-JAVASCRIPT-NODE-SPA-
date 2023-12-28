

const part_2 = document.querySelector(".part-2");
const part_3 = document.querySelector(".part-3");
const text_input = document.querySelector(".text-input");
const button = document.querySelector(".button");
const button_box = document.querySelector(".botten-box");


const all_radio = document.querySelector("#all-radio");
const completed_radio = document.querySelector("#completed-radio");
const inprogress_radio = document.querySelector("#inprogress-radio");
const radio = document.querySelectorAll('.radio')


const prev_button = document.querySelector("#prev-button");
const next_button = document.querySelector("#next-button");
const page_lable = document.querySelector("#page-lable");

let checkbox = document.querySelector("#checkbox")
let h2 = document.querySelector(".h2")

let limit = 4,
    finished = undefined,
    curentPage = 1,
    totalTasks,
    totalPage;


axios.defaults.baseURL = 'http://localhost:3001/'

//------------DOM reload event
document.addEventListener('DOMContentLoaded', async () => {
    all_radio.checked = true
    loadTasks();
})


//--------page load function
async function loadTasks() {
    try {

        const { data } = await axios.get(`/tasks?pages=${curentPage}&limit=${limit}&finished=${finished}`)


        if (data.success) {

            let srt = "";

            if (data.body.length) {
                h2.style.display = 'none'
                part_2.style.border = '2px solid rgb(212, 212, 212)';

                for (let task of data.body) {

                    srt += `
                               
                          <div class="task"   data-id=${task.id}>
                                <div class="text-box">
                                     <p id=task${task.id}>${task.title} </p>
                                </div>
                                <div class="botten-box">
                                     <span class= ${task.completed ? 'progressgreen' : 'progressgray'}>  ${task.completed ? 'completed' : 'inprogress'} </span>
                                     <button type="submit" class=  ${task.completed ? 'gray' : 'green'}>toggle</button>
                                     <button type="submit" class="blue">edite</button>
                                     <button type="submit" class="red">delete</button>
                                </div>
                           </div>`
                }

                part_2.innerHTML = srt

            } else {
                part_2.style.border = 'none'
                h2.style.display = 'block'
            }

            totalTasks = data.totalTasks;

            if (totalTasks > limit) {

                part_3.classList.remove('d-none')
                totalPage = Math.ceil(totalTasks / limit);
                prev_button.disabled = next_button.disabled = false;

                if (curentPage === 1) {

                    prev_button.disabled = true
                } else if (curentPage === totalPage) {
                    next_button.disabled = true
                }

                page_lable.innerHTML = `page ${curentPage} of ${totalPage}`
            } else {
                part_3.classList.add('d-none');
                totalPage = 1
            }
        }

    } catch (error) {

    }
}

//---------next button event
next_button.addEventListener('click', () => {
    curentPage++;

    console.log(curentPage);
    loadTasks();
})

//---------prev button event
prev_button.addEventListener('click', () => {
    curentPage--;
    console.log(curentPage);
    loadTasks();

})


//----------radio input event
radio.forEach((element) => {
    element.addEventListener('change', async (e) => {
        if (e.target.checked && e.target === all_radio) {
            inprogress_radio.checked = false
            completed_radio.checked = false
            finished = undefined
            curentPage = 1

            loadTasks()
        }
        if (e.target.checked && e.target === completed_radio) {
            inprogress_radio.checked = false
            all_radio.checked = false;
            finished = true
            curentPage = 1


            loadTasks()
        }
        if (e.target.checked && e.target === inprogress_radio) {
            completed_radio.checked = false
            all_radio.checked = false;
            finished = false
            curentPage = 1
            loadTasks()
        }
    })
})


//---------- toggle , edite , delete button event
part_2.addEventListener("click", async (e) => {
  const target = e.target;
        const id = parseInt(target.parentElement.parentElement.dataset.id);
        let title;
        const completed = target.classList.contains('gray') ? false : true



    //----------------toggle request 
    if (target.classList.contains("gray") || target.classList.contains("green")) {
      

        let response;
        title = document.querySelector(`#task${id}`).innerText
        
        try {
            response = await axios.put(`/tasks/${id}`, { title, completed });

            if (response.data.success) {

                const badge = target.parentElement.children[0]

                if (badge.innerText === 'Completed') {

                    badge.innerText = 'inprogress'
                    e.target.classList.remove('gray')
                    e.target.classList.add('green')
                    badge.classList.remove('progressgreen')
                    badge.classList.add('progressgray')

                }
                else {

                    badge.innerText = 'completed'
                    e.target.classList.add('gray')
                    e.target.classList.remove('green')
                    badge.classList.remove('progressgray')
                    badge.classList.add('progressgreen')

                }

            } else {
                alert(data.message)
            }
        } catch (e) {
            alert(e.message);
        }
    }


    //--------------edit request

    else if (target.classList.contains("blue")) {

        title = document.querySelector(`#task${id}`).innerText

        const answer = prompt("Please entre new title:", title);

        const completed = target.parentElement.children[1].classList.value == 'gray' ? true : false


        if (answer) {
            try {
                const { data } = await axios.put("/tasks/" + id, { title: answer, completed });

                if (data.success) {
                    document.querySelector(`#task${id}`).innerText = answer
                }
            } catch (e) {
                alert(data.message)
            }
        }
    }



    //-----------delete request

    else if (target.classList.contains("red")) {

        if (confirm("are you sure?")) {
            try {
                const { data } = await axios.delete("/tasks/" + id);
                if (data.success) {

                    target.parentElement.parentElement.remove();
                    loadTasks();


                    if (!document.querySelectorAll('.task').length) {


                        if (totalPage === 1) {
                            h2.style.display = 'block'
                            
                        }
                        if (totalPage && totalPage % limit) {
                            curentPage--;
                            loadTasks()
                        }


                    }
                } else {
                    alert('internel server error')
                }
            } catch (e) {
                alert(e.message);
            }
        }

    }
})


// ------------add event handler
async function eventHandler(e) {
    if (text_input.value == '') {

        alert('please insert title ')

    } else {

        h2.classList.add('d-none')
        part_2.style.border = 'none'
        const title = text_input.value

        const completed = checkbox.checked

        try {
            const { data } = await axios.post('/tasks', { title, completed })

            if (data.body.length) {
                h2.style.display = 'none'
                console.log(data.body.length);
            }


            if (data.success) {

                const completedTask = data.tasks.filter(task => task.completed === true)
                const inprogressTask = data.tasks.filter(task => task.completed === false)


                if (completed_radio.checked) {
                    totalTasks = completedTask.length
                    if (checkbox.checked) {
                        curentPage = Math.ceil(totalTasks / limit);

                    }

                    else {
                        finished = undefined
                        curentPage = totalPage
                        loadTasks()
                        completed_radio.checked = false
                        all_radio.checked = true
                    }
                }
                if (inprogress_radio.checked) {
                    totalTasks = inprogressTask.length;
                    if (!checkbox.checked) {
                        curentPage = Math.ceil(totalTasks / limit);

                    }
                    else {
                        finished = undefined
                        curentPage = totalPage
                        loadTasks()
                        inprogress_radio.checked = false
                        all_radio.checked = true

                    }
                }
                if (all_radio.checked) {

                    if (data.tasks.length) {
                        totalTasks = data.tasks.length
                        curentPage = Math.ceil(totalTasks / limit);
                    }
                    else {
                        console.log(true);
                    }

                }

                loadTasks()
                text_input.value = ''
            }
            else {

                alert(data.message);
            }
        } catch (error) {
            alert(error.message)
        }

    }
}

//------------add event
button.addEventListener('click', eventHandler)
text_input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        eventHandler()
    }
})






