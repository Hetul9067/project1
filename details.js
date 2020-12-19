create= document.querySelector('.btn-create');
save= document.querySelector('.btn-save');
firstPage = document.querySelector('.page-1');
secondPage  = document.querySelector('.page-2-main');
formDetail = document.querySelector('.form-details');
tableHead = document.querySelector('thead');
tableBody = document.querySelector('tbody');
outerSubmit = document.querySelector('.form-outer')


let detailObject=[] ;
const database = [];
const svClAns = [];
let getData;

//set data on local storage
const storeData = function(database) {
    localStorage.setItem('PersonalDetail',JSON.stringify(database));
}

//get data on local storage
const getLocalStorage = function() {
    getData = JSON.parse(localStorage.getItem('PersonalDetail'));
    return getData;
}



// for opening second page;
const openSecondPage = function () {
    firstPage.classList.toggle('hidden');
    secondPage.classList.toggle('hidden');
}

create.addEventListener('click',openSecondPage );

// detail class
class Detail  {
    constructor (data) {
        // console.log(firstName);
        this.firstName = data.firstName[0].toUpperCase() + data.firstName.slice(1).toLowerCase();
        this.surname = data.surname[0].toUpperCase() + data.surname.slice(1).toLowerCase();
        this.gender = data.gender[0].toUpperCase() + data.gender.slice(1).toLowerCase();
        this.birthDate = data.birthDate;
        
    }
    
    name () {
        this.fullName = [this.firstName,this.surname].join(' ');
        return this.fullName;
    } 
    
    ageCalc () {
        const year = new Date().getFullYear();
        this.age = year - (+this.birthDate.slice(0,4));
        return this.age;
    }
}


// fetch form data
let h1;

formDetail.addEventListener('submit',function(e) {
    e.preventDefault();
    
    const dataArr = [...new FormData(formDetail)];
    const data = Object.fromEntries(dataArr);
    const dataAll = {
        firstName : data.fname,
        surname : data.sname,
        gender : data.gen,
        birthDate : data.bday,
    }
    h1 = new Detail(dataAll);
    dataAll.fullName = h1.name();
    dataAll.age = h1.ageCalc();
    detailObject.push(h1);
    storeData(detailObject);
    renderTable();
    formDetail.reset();
    
})

//render a first page
const renderTable = function () {
    if(localStorage.length > 0) {
        detailObject = getLocalStorage();
    }
    else {
        tableBody.innerHTML = '';
        return;

    }
    tableBody.innerHTML = '';
    
    
    detailObject.forEach(function(data, i,arr) {
        const markup = `
        <tr>
            <td class="fname" id='editHover' data-no="${i}" >${data.firstName}</td>
            <td class='sname' id='editHover' data-no="${i}">${data.surname}</td>
            <td>${data.fullName}</td>
            <td >${data.age} </td>
            <td class="gender" id='editHover' data-no="${i}">${data.gender}</td>
            <td class="birthdate" id='editHover'  data-no="${i}">${data.birthDate}</td>
            <td id="del" >
                <button type = "button" id="btn-del" data-no="${i}">Delete</button>
            </td>
        </tr>
        
        `;
        tableBody.insertAdjacentHTML('beforeend',markup);
    });
}





//save button
const sv = function(e) {
    
    firstPage.classList.toggle('hidden');
    secondPage.classList.toggle('hidden');
    
    renderTable();
    
}
save.addEventListener('click',sv)



// delete button call back function

document.addEventListener('click',function(e) {
    if(e.target && e.target.getAttribute('id') === 'btn-del') {
        console.log(e.target);
        // console.log(dataObject);
        const data = getLocalStorage();
        const delEl = e.target.getAttribute('data-no');
        data.splice(delEl,1);
        
        storeData(data);
        renderTable();
        location.reload();
        
        
    }
})


// update data submit 
let counter ;
let updateAvailable = false;
document.addEventListener('submit',function(e) {
    e.preventDefault();
    // console.log('helllo');
    const text = e.target.firstElementChild.value;
    console.log(updateAvailable);
    if(updateAvailable) {
        if (text) {
            const idName = e.target.firstElementChild.getAttribute('id');
            const data = getLocalStorage();
            console.log(data);
            data.forEach(function(dataObject,i,arr) {
                if(i === +counter){
                    if(idName === 'editfname' ) {

                        dataObject.firstName = text;
                        const xdata = new Detail(dataObject);
                        dataObject.firstName = xdata.firstName;
                        dataObject.fullName = xdata.name();
                    } else if(idName === 'editsname' ) {
                        dataObject.surname = text;
                        const xdata = new Detail(dataObject);
                        dataObject.surname = xdata.surname;

                        dataObject.fullName = xdata.name();

                    } else if (idName === 'editgender') {
                        dataObject.gender = text[0].toUpperCase() + text.slice(1).toLowerCase();

                    } 

                }
            })

            storeData(data)
            renderTable();
            

        } else {
            e.target.innerHTML='';
            renderTable();
        }
        updateAvailable = false;
    }
})


//date update function
const dateSubmit = function(event) {
    const text = event.target.value;
    if(event.keyCode === 13 && text) {
        const idName = event.target.getAttribute('id');
        const data = getLocalStorage();
        data.forEach(function(dataObject,i,arr) {
            if(idName === 'editbirthdate') {
                dataObject.birthDate = text;
                const xdata = new Detail(dataObject);
                dataObject.age = xdata.ageCalc();
                // console.log(dataObject);
            }
        })
        storeData(data);
        renderTable();
    } else if(event.keyCode === 13) {
        event.target.parentElement.innerHTML = '';
        renderTable();
    } 

}


// click event for edit 
document.addEventListener('click', function(e) {
    const className = e.target.getAttribute('class');
    if(e.target && className === 'fname' || className === 'sname' || className === 'gender'  ) {
        e.target.innerHTML = '';

        counter = e.target.getAttribute('data-no')

        const markup = 
            `
            <form class='formname'>
                <input type= "text" id="edit${className}"  data-no="${counter}" name="edit${className}">
            </form>`;
        e.target.insertAdjacentHTML('beforeend',markup);
        updateAvailable=true;

    } 
    else if (e.target && className === 'birthdate') {
        e.target.innerHTML = '';
        console.log(e.target);
        counter = e.target.getAttribute('data-no');

        const markup = 
            `
            <form class='formname'>
                <input type="date" id="edit${className}" data-no="${counter}" name="edit${className}"  onkeydown='dateSubmit(event)'>
            </form>`;
        e.target.insertAdjacentHTML('beforeend',markup);
        // console.log('click');
        updateAvailable=true;
    }

})


const init = function() {
    getLocalStorage();
    renderTable();
}
init();
