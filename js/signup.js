//====================================================
// SCOLEX STUDENT SIGNUP
//====================================================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzqumYANoor1bpTJnx9DEoy1WzYn-Ve10Pilrc5QPrL2f5X67LkL39pNKwX1Vn75fPnYA/exec";



function signup(){



const name = document.getElementById("name").value.trim();

const father = document.getElementById("father").value.trim();

const mobile = document.getElementById("mobile").value.trim();

const email = document.getElementById("email").value.trim();

const course = document.getElementById("course").value;

const password = document.getElementById("password").value;

const confirm = document.getElementById("confirm").value;




// Password Check

if(password !== confirm){

alert("Password and Confirm Password do not match!");

return;

}




const signupData = {


action:"signup",

name:name,

father:father,

mobile:mobile,

email:email,

course:course,

password:password


};





fetch(SCRIPT_URL,{


method:"POST",


headers:{


"Content-Type":"text/plain;charset=utf-8"


},


body:JSON.stringify(signupData)



})



.then(response=>response.json())



.then(data=>{



console.log(data);



if(data.status=="success"){


alert(
"Registration Successful!\nYour Student ID: "
+data.studentId
);


window.location.href="login.html";


}



else if(data.status=="exists"){


alert("Mobile Number Already Registered!");


}



else{


alert("Registration Failed");


}



})



.catch(error=>{


console.log(error);


alert("Server Error");


});



}