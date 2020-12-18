create= document.querySelector('.btn-create');
save= document.querySelector('.btn-save');
cancel= document.querySelector('.btn-cancel');
update= document.querySelector('.btn-update');
firstPage = document.querySelector('.page-1');
secondPage  = document.querySelector('.page-2-main');
formDetail = document.querySelector('.form-details');
saveCancelContainer = document.querySelector('.btn-sv-cl')
tableHead = document.querySelector('thead');
tableBody = document.querySelector('tbody');
outerSubmit = document.querySelector('.form-outer')


let detailObject=[] ;
const database = [];
const svClAns = [];
let getData;
let ans;
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
        this.firstName = data.firstName[0].toUpperCase() + data.firstName.slice(1);
        this.surname = data.surname[0].toUpperCase() + data.surname.slice(1);
        this.gender = data.gender;
        this.birthDate = data.birthDate;
        this.ans = ans;
    }
    
    name () {
        this.fullName = [this.firstName,this.surname].join(' ');
        return this.fullName;
    } 
    
    ageCalc () {
        const year = new Date().getFullYear();
        console.log(year);
        this.age = year - (+this.birthDate.slice(0,4));
        return this.age;
    }
}

let updateFlag = false;
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
    dataAll.saveCancel = ans;
    let available = false;
    if (dataAll.saveCancel === 'Cancelled' ) {
        detailObject.forEach(function(data) {
            // console.log(data);
            if(data.fullName === dataAll.fullName) {
                data.saveCancel = 'Cancelled';
                available = true;
            }   
        });
        if(available === false) {
            alert ('For this operation, same data require')
        }       
        storeData(detailObject);

        renderTable();
        formDetail.reset();

        return;
        
    }
    console.log(updateFlag);
    let availableUpdate = true;
    if(updateFlag) {
        console.log("we got it" );
        console.log(dataAll.firstName);
        detailObject.forEach(function(data) {
            if(data.firstName === dataAll.firstName) {
                data.surname = dataAll.surname;
                data.gender = dataAll.gender;
                data.birthDate = dataAll.birthDate;
                data.fullName = dataAll.fullName;
                data.age = dataAll.age;
                data.saveCancel = data.saveCancel;
                availableUpdate = false;
            }
        })
        if(availableUpdate) {
            alert('data not found');
            
        }
        availableUpdate = false;
        updateFlag = false;
        storeData(detailObject);
        renderTable();
        formDetail.reset();

        return;    
            

    }

    detailObject.push(dataAll);
    storeData(detailObject);
    renderTable();
    formDetail.reset();
    
})

// update button
const updateDetail = function(e) {
    updateFlag = true;

}


update.addEventListener('click',updateDetail)

console.log(localStorage.length);
// render table 
const renderTable = function () {
    console.log(localStorage.length);
    if(localStorage.length > 0) {
        detailObject = getLocalStorage();
    }
    else {
        tableBody.innerHTML = '';
        return;

    }
    tableBody.innerHTML = '';
    const addMarkup = 
    `<td id="del" rowspan=${detailObject.length}>
    <button type = "button" id="btn-del">Delete</button>
    </td>`;
    
    detailObject.forEach(function(data, i,arr) {
        
        const markup = `
        
        <tr>
        <td class="fname" >${data.firstName}</td>
        <td class='sname'>${data.surname}</td>
        <td>${data.fullName}</td>
        <td>${data.age}</td>
        <td class="gender">${data.gender}</td>
        <td class="birthdate">${data.birthDate}</td>
        
        ${(i===0)?addMarkup:''}
        </tr>
        
        `;
        tableBody.insertAdjacentHTML('beforeend',markup);
    });
}
// save cancel return;
const svCl = function(e) {
    if(e.target.getAttribute('class') === 'btn-save' || e.target.getAttribute('class') === 'btn-cancel') {
            ans = e.target.getAttribute('class') === 'btn-save' ? 'Saved' : 'Cancelled' ;
            console.log(ans);
            firstPage.classList.toggle('hidden');
            secondPage.classList.toggle('hidden');
            renderTable();

            }
}
saveCancelContainer.addEventListener('click',svCl)
        



// delete button call back function

document.addEventListener('click',function(e) {
    if(e.target && e.target.getAttribute('id') === 'btn-del') {
        localStorage.removeItem('PersonalDetail');
        location.reload();
        renderTable();
        
    }
})

document.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('hii');
    console.log(e.target.querySelector('#editFname').value);
    const text = e.target.querySelector('#editFname').value;
    const data = getLocalStorage();
    console.log(data);
    data[0].firstName = text;
    data[0].fullName = 
    console.log(data);
})


document.addEventListener('click', function(e) {
    // console.log(e.target.textContent);
    console.log(e.target);
    if(e.target && e.target.getAttribute('class') === 'fname') {
        const markup = 
        `
        <form class='formname'>
            <input type= "text" id="editFname" name="editFname">
        </form>`;
        // e.target.innerHTML = '';
        e.target.insertAdjacentHTML('beforeend',markup);
    }
    else if (e.target && e.target.getAttribute('class') === 'sname') {

    }
    console.log(e.target);
})




const init = function() {
    getLocalStorage();
    renderTable();
}
init();
