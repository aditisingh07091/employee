/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var empDBName = "EMP-DB";
var empRelationName = "EmpData";
var connToken = "90931444|-31949324937321833|90950083";


$("#empId").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getEmpIdAsJsonObj() {
    var empId = $("#empId").val();
    var jsonStr = {
        id: empId
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    //$("#empId").val(record.id);

    $("#empName").val(record.name);
    $("#empSal").val(record.salary);
    $("#hra").val(record.hra);
    $("#da").val(record.da);
    $("#deduct").val(record.deduction);
}




// Function to reset the form
function resetForm() {
    $("#empId").val("");
    $("#empName").val("");
    $("#empSal").val("");
    $("#hra").val("");
    $("#da").val("");
    $("#deduct").val("");
    $("#empId").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#empId").focus();
}

function validateData() {

    var empId, empName, empSal, hra, da, deduct;
    empId = $("#empId").val();
    empName = $("#empName").val();
    empSal = $("#empSal").val();
    hra = $("#hra").val();
    da = $("#da").val();
    deduct = $("#deduct").val();


    if (empId === "") {
        alert("Employee ID missing");
        $("#empId").focus();
        return "";
    }
    if (empName === "") {
        alert("Employee Name missing");
        $("#empName").focus();
        return "";
    }
    if (empSal === "") {
        alert("Employee Salary missing");
        $("#empSal").focus();
        return "";
    }
    if (hra === "") {
        alert("HRA missing");
        $("#hra").focus();
        return "";
    }
    if (da === "") {
        alert("DA missing");
        $("#da").focus();
        return "";
    }
    if (deduct === "") {
        alert("Deduction  missing");
        $("#deduct").focus();
        return;
    }

    var jsonStrObj = {
        //id: empId,
        name: empName,
        salary: empSal,
        hra: hra,
        da: da,
        deduction: deduct
    };
    return JSON.stringify(jsonStrObj);
}



function getEmp(){
    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, empIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);

    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#empName").focus();
    } else if (resJsonObj.status === 200) {

        $("#empId").prop("disabled", true);
        fillData(resJsonObj);

        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#empName").focus();


    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    
    resetForm();
    $("#empId").focus();


}

function changeData() {
    $("#change").prop("disabled", true);
    jsonChg = validateData();

    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, empDBName, empRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#empId").focus();


}



