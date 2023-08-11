/*Region 1*/
const gREQUEST_STATUS_OK = 200;
const gREQUEST_CREATE_OK = 201; // status 201 là tạo mới thành công
const gREQUEST_READY_STATUS_FINISH_AND_OK = 4;

var gBASE_URL = "https://pucci-mart.onrender.com/api";

// Biến mảng hằng số chứa danh sách tên các thuộc tính
const gPET_COLS = [
  "stt",
  "id",
  "name",
  "description",
  "imageUrl",
  "price",
  "promotionPrice",
  "type",
  "createdAt",
  "updatedAt",
  "action",
];

// Biến mảng toàn cục định nghĩa chỉ số các cột tương ứng
const gPET_STT_COL = 0;
const gPET_ID_COL = 1;
const gPET_NAME_COL = 2;
const gPET_DESCRIPTION_COL = 3;
const gPET_IMAGEURL_COL = 4;
const gPET_PRICE_COL = 5;
const gPET_PROMOTIONPRICE_COL = 6;
const gPET_TYPE_COL = 7;
const gPET_CREATEDAT_COL = 8;
const gPET_UPDATEDAT_COL = 9;
const gPET_ACTION_COL = 10;

// Biến toàn cục để hiển lưu STT
var gSTT = 1;

var gListObjs = [];

var gDataTable = $("#table-pets").DataTable({
  columns: [
    { data: gPET_COLS[gPET_STT_COL] },
    { data: gPET_COLS[gPET_ID_COL] },
    { data: gPET_COLS[gPET_NAME_COL] },
    { data: gPET_COLS[gPET_DESCRIPTION_COL] },
    { data: gPET_COLS[gPET_IMAGEURL_COL] },
    { data: gPET_COLS[gPET_PRICE_COL] },
    { data: gPET_COLS[gPET_PROMOTIONPRICE_COL] },
    { data: gPET_COLS[gPET_TYPE_COL] },
    { data: gPET_COLS[gPET_CREATEDAT_COL] },
    { data: gPET_COLS[gPET_UPDATEDAT_COL] },
    { data: gPET_COLS[gPET_ACTION_COL] },
  ],
  columnDefs: [
    {
      targets: gPET_STT_COL,
      render: function () {
        return gSTT++;
      },
    },
    {
      targets: gPET_IMAGEURL_COL,
      render: function (data) {
        return `<img src="${data}" width="40px">`;
      },
    },
    {
      targets: gPET_ACTION_COL,
      defaultContent: `<div class="btn-group" role="group">
      <button type="button" class="btn btn-primary btn-detail">Detail</button>
      <button type="button" class="btn btn-warning btn-edit">Edit</button>
      <button type="button" class="btn btn-danger btn-delete">Delete</button>
      </div>`,
    },
  ],
});

/*Region 2*/
$("#btn-create").on("click", function () {
  onCreateClick(this);
});
$("#btn-add").on("click", function () {
  onAddClick(this);
});
$("#table-pets").on("click", ".btn-detail", function () {
  onDetailClick(this);
});
$("#table-pets").on("click", ".btn-edit", function () {
  onEditClick(this);
});
$("#btn-update").on("click", function () {
  onUpdateClick(this);
});
$("#table-pets").on("click", ".btn-delete", function () {
  onDeleteClick(this);
});
$("#btn-destroy").on("click", function () {
  onDestroyClick(this);
});
$("#btn-filter-pet").on("click", function () {
  onFilterClick(this);
});

/*Region 3*/
$(document).ready(function () {
  onGetPetsListClick();
  loadDataToDataTable(gListObjs);
});

function onCreateClick() {
  $("#modal-create").modal("show");
}

function onAddClick() {
  // khai báo đối tượng chứa data
  var vInfo = {
    type: "", // Trường type có giá trị thuộc danh sách sau: "Dog" || "Cat" || "Fish" || "Bird" || "Rabbit"
    name: "",
    description: "",
    imageUrl: "",
    price: 0,
    promotionPrice: 0,
    createdAt: getCurrentDate(),
    updatedAt: getCurrentDate(),
  };
  //B1: thu thập dữ liệu
  collectNewData(vInfo);
  //B2: Validate insert
  var vIsValidate = validateData(vInfo);
  if (vIsValidate) {
    // B3: insert user
    onCreatePetClick(vInfo);
    //B4: xử lý front-end
    //gọi api lấy danh sách user
    onGetPetsListClick();
    // load lại vào bảng (table)
    loadDataToDataTable(gListObjs);
    // reset form modal
    $("#new-input-name").val("");
    $("#new-input-description").val("");
    $("#new-input-image").attr("src", "");
    $("#new-input-price").val("");
    $("#new-input-promotionPrice").val("");
    $("#new-input-type").val("");
    $("#modal-create").modal("hide");
  }
}

function onDetailClick(paramDetailButton) {
  var vData = extractData(paramDetailButton);

  // gọi và truyền data qua form Details
  const vDETAIL_FORM_URL = "detail.html";
  var vUrlSiteToOpen = vDETAIL_FORM_URL + `?id=${vData.id}`;
  window.location.href = vUrlSiteToOpen;
}

function onEditClick(paramDetailButton) {
  var vData = extractData(paramDetailButton);
  $("#modal-edit").modal("show");
  // fill data to form
  $("#input-id").val(vData.id);
  $("#input-name").val(vData.name);
  $("#input-description").val(vData.description);
  $("#input-view-image").attr("src", vData.imageUrl);
  $("#input-price").val(vData.price);
  $("#input-promotionPrice").val(vData.promotionPrice);
  $("#input-type").val(vData.type);
  $("#input-createdAt").val(vData.createdAt);
  $("#input-updatedAt").val(vData.updatedAt);
}

function onUpdateClick() {
  // khai báo đối tượng chứa data
  var vInfo = {
    id: "",
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    promotionPrice: "",
    type: "",
    createdAt: "",
    updatedAt: getCurrentDate(),
  };
  //B1: thu thập dữ liệu
  collectData(vInfo);
  // B2: Validate update
  var vIsValidate = validateData(vInfo);
  if (vIsValidate) {
    // API sửa thông tin Pet dựa vào id
    onUpatePetClick(vInfo);
    // B4: xử lý front-end
    //load lại bảng
    onGetPetsListClick();
    loadDataToDataTable(gListObjs);
    // reset form modal
    $("#input-id").val("");
    $("#input-name").val("");
    $("#input-description").val("");
    $("#input-view-image").attr("src", "");
    $("#input-image").attr("src", "");
    $("#input-price").val("");
    $("#input-promotionPrice").val("");
    $("#input-type").val("");
    $("#input-createdAt").val("");
    $("#input-updatedAt").val("");
    $("#modal-edit").modal("hide");
  }
}

function onDeleteClick(paramDetailButton) {
  var vData = extractData(paramDetailButton);
  $("#modal-delete").modal("show");
  $("#hidden-input-id").val(vData.id);
}

function onDestroyClick() {
  let vId = parseInt($("#hidden-input-id").val());
  onDeletePetClick(vId);
  //load lại bảng
  onGetPetsListClick();
  loadDataToDataTable(gListObjs);
  $("#modal-delete").modal("hide");
}

function onFilterClick() {
  // Add your custom filter function only once (not at every click)
  $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
    const min = $("#gMinPriceSelect").val();
    const max = $("#gMaxPriceSelect").val();
    const price = data[gPET_PRICE_COL];
    console.log(min, max);

    if (
      (min === null && max === null) ||
      (min === null && price <= max) ||
      (min <= price && max === null) ||
      (min <= price && price <= max)
    ) {
      return true;
    }
    return false;
  });

  gDataTable.search();
  gDataTable.draw();
}

/*Region 4*/
// API lấy danh sách Pets
function onGetPetsListClick() {
  $.ajax({
    async: false,
    type: "get",
    url: gBASE_URL + "/pets",
    dataType: "json",
    success: function (res) {
      //   console.log(res.rows);
      gListObjs = res.rows;
    },
    error: function (error) {
      console.log(error);
    },
  });
}

// API tạo Pet mới
function onCreatePetClick(paramInfo) {
  console.log(paramInfo);
  $.ajax({
    type: "post",
    headers: {
      "Content-Type": "application/json",
    },
    url: gBASE_URL + "/pets",
    dataType: "json",
    data: JSON.stringify(paramInfo),
    success: function (paramData) {
      console.log(paramData);
      alert("Thêm pet thành công!");
    },
    error: function (error) {
      console.log(error);
    },
  });
}

// API sửa thông tin Pet dựa vào id
function onUpatePetClick(paramInfo) {
  $.ajax({
    type: "put",
    headers: {
      "Content-Type": "application/json",
    },
    url: gBASE_URL + "/pets/" + paramInfo.id,
    dataType: "json",
    data: JSON.stringify(paramInfo),
    success: function (paramData) {
      console.log(paramData);
      alert("Chỉnh sửa pet thành công!");
    },
    error: function (error) {
      console.log(error);
    },
  });
}

// API xóa thông tin Pet dựa vào id
function onDeletePetClick(paramId) {
  $.ajax({
    type: "delete",
    url: gBASE_URL + "/pets/" + paramId,
    dataType: "json",
    success: function (paramData) {
      console.log(paramData);
      alert("Đã xóa pet thành công!");
    },
    error: function (error) {
      console.log(error);
    },
  });
}

/*Helpers*/
const extractData = (paramDetailButton) => {
  var vRowClick = $(paramDetailButton).closest("tr");
  var vTable = $("#table-pets").DataTable();
  return vTable.row(vRowClick).data();
};

const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
};

/**  Load data to DataTable
 * in: array
 * out: table has data
 */
function loadDataToDataTable(paramObjects) {
  //   console.log(paramObjects);
  gDataTable.clear();
  gDataTable.rows.add(paramObjects);
  gDataTable.draw();
}

function collectNewData(paramInfo) {
  paramInfo.name = $("#new-input-name").val().trim();
  paramInfo.description = $("#new-input-description").val().trim();
  paramInfo.imageUrl = $("#new-input-image").val().trim();
  paramInfo.price = $("#new-input-price").val().trim();
  paramInfo.promotionPrice = $("#new-input-promotionPrice").val().trim();
  paramInfo.type = $("#new-input-type").val().trim();
}

function collectData(paramInfo) {
  paramInfo.id = $("#input-id").val().trim();
  paramInfo.name = $("#input-name").val().trim();
  paramInfo.description = $("#input-description").val().trim();
  paramInfo.imageUrl = $("#input-image").val().trim();
  paramInfo.price = $("#input-price").val().trim();
  paramInfo.promotionPrice = $("#input-promotionPrice").val().trim();
  paramInfo.type = $("#input-type").val().trim();
  paramInfo.createdAt = $("#input-createdAt").val().trim();
}

//hàm validate dữ liệu nhập trên form update user
function validateData(paramInfo) {
  "use strict";
  if (paramInfo.name == "") {
    alert("name cần nhập");
    return false;
  }
  if (paramInfo.description == "") {
    alert("description cần nhập");
    return false;
  }
  if (paramInfo.imageUrl == "") {
    alert("image cần nhập");
    return false;
  }
  if (paramInfo.price == "") {
    alert("price cần nhập");
    return false;
  }
  if (paramInfo.promotionPrice == "") {
    alert("promotionPrice cần nhập");
    return false;
  }
  if (paramInfo.type == "") {
    alert("type cần nhập");
    return false;
  }
  return true;
}
