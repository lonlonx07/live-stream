function add_entry(entry_type){
    if (entry_type == 1)
        entry_type = "vocab"
    else if (entry_type == 2)
        entry_type = "kanji"

    form_data = {
        type: entry_type,
        kanji: document.getElementById("inp_kanji").value,
        hirakata: document.getElementById("inp_hirakata").value,
        romaji: document.getElementById("inp_romaji").value,
        english: document.getElementById("inp_english").value,
        others: document.getElementById("inp_others").value
    }
    
    fetch("/add-entry", {
        method:"POST",
        body: JSON.stringify(form_data),
    }).then((_res)=>{
        //window.location.href = "/";
    });
}

let contacts_info = []
let cur_convo = false;
let cur_uid = ""
let cur_cuid = ""
function addPost(){
    data = document.getElementById("post").value;
    fetch("/add-post", {
        method:"POST",
        body: JSON.stringify({data: data}),
    }).then((_res)=>{
        window.location.href = "/";
    });
}

function deletePost(id){
    fetch("/delete-post", {
        method:"POST",
        body: JSON.stringify({postId: id}),
    }).then((_res)=>{
        window.location.href = "/";
    });
}

function likePost(id){
    fetch("/like-post", {
        method:"POST",
        body: JSON.stringify({postId: id}),
    }).then(response => response.json()).then(json => { 
        if(json['count'] != 0)
            document.getElementById("react_"+id).innerHTML = "("+json['count']+")";
        else
             document.getElementById("react_"+id).innerHTML = "";

        if(document.getElementById("thumb_"+id).classList.contains("liked-icon"))
            document.getElementById("thumb_"+id).classList.remove("liked-icon");
        else
            document.getElementById("thumb_"+id).classList.add("liked-icon");
    });
}

function format_chat(id, val){
    let tmp_str = "";
    if(val == "server-offline"){
        tmp_str += "<div class='text-sm-center m-1'>Chat Server Offline</div>";
    }
    else{
        val = "["+val.replaceAll("&#34;","\"")+"]";
        msg_data = JSON.parse(val);
        for(i=0; i<msg_data.length; i++){
            tmp_indc = "";
            if(msg_data[i].user_id == id){
                tmp_str += "<div class='text-sm-right m-1'>";
                tmp_str += "<div class='border rounded-left ml-4 p-1 bg-primary text-white'>";
            }
            else{
                tmp_str += "<div class='text-sm-left m-1'>";
                tmp_str += "<div class='border rounded-right mr-4 p-1 bg-secondary text-white'>";
                tmp_indc = "<div style='font-size:10px;font-style:italic;'>"+contacts_info[msg_data[i].user_id]+"</div>";
            }
            
            tmp_str += msg_data[i].msg;
            //tmp_str += tmp_indc;
            tmp_str += "</div>";
            tmp_str += "</div>";
        }
        
    }

    $("#chat_view").html(tmp_str);
    $("#txt_message").val("");
    //try{document.getElementById("txt_message").value = "";}catch(e){}
    const element = document.getElementById("chat_view");
    element.scrollTop = element.scrollHeight;
}

function send_message(cuid, id, cnd){
    if(cur_convo){
        if(cnd == 0)
            data = "update";
        else
            data = document.getElementById("txt_message").value;
        
        fetch("/send-msg", {
            method:"POST",
            body: JSON.stringify({data: data}),
        }).then(response => response.json()).then(json => { 
            //console.log(json['thread'], "<-", data);  

            try{
                format_chat(id, json['thread']);
            }
            catch(e){
                $("#chat_view").html("");
            }
        });
    }
    else{
        alert("Select a contact first!")
    }
}

function init_chat(cuid, uid){
    $("#current_chat").html(contacts_info[cuid]);
    $("#txt_message").val("");
    $("#chat_view").val("")

    cur_uid = uid;
    cur_cuid = cuid;

    //document.getElementById("current_chat").innerHTML = contacts_info[cuid];
    //document.getElementById("txt_message").value = "";
    //document.getElementById("chat_view").innerHTML = "";
    fetch("/set-chat-room", {
        method:"POST",
        body: JSON.stringify({data:cuid}),
    }).then((_res)=>{
        cur_convo = true;
        send_message(cuid, uid, 0);
    });
}

function receive_message(id){
    fetch("/rcve-msg", {
        method:"GET",
    }).then(response => response.json()).then(json => { 
        console.log(json['thread'])
    });
}

function check_key(event, id, cnd){
    let value= event.which;
    if(value == 13){
        data = document.getElementById("txt_message").value;
        document.getElementById("txt_message").value = data.substr(0, data.length-1)
        //console.log(data.length);
        send_message(0, id, cnd)
    }
}

function add_contact(uid, uid2){
    console.log(uid, uid2)
    
    fetch("/add-contact", {
        method:"POST",
        body: JSON.stringify({user_a: uid, user_b: uid2}),
    }).then(response => response.json()).then(json => { 
        
    });
}

function nav_page(ind){
    if(ind == 1)
        window.location.href = "/";
    else if(ind == 3)
        window.location.href = "/streams";
    else if(ind == 4)
        window.location.href = "/photos";
    else if(ind == 5)
        window.location.href = "/mails";
    else if(ind == 6)
        window.location.href = "/compose-mail";
}

function set_contacts(uid, uname){
    contacts_info[uid] = uname;
}

function send_mail_message(){
    mail_content['subject'] = $("#mail_subject").val()
    mail_content['message'] = $("#mail_content").val()
    fetch("/send-mail", {
        method:"POST",
        body: JSON.stringify({receiver: receiver_arr, content:mail_content}),
    }).then((_res)=>{
        window.location.href = "/mails";
    });
}

let receiver_arr = []
let receiver_text = []
let mail_content = {'subject':'', 'message':''}
let receiver_cnt = 0;
function selected_contact(obj, id, name, email){
    if($(obj).prop("checked")){
        receiver_text.push(name+"<"+email+">");
        receiver_arr.push(id);
    }
    else{
        let tmp_ind = receiver_text.indexOf(name+"<"+email+">");
        receiver_text.splice(tmp_ind, 1);
        receiver_arr.splice(tmp_ind, 1);
    }

    let receiver_list = "";
    for(let i=0; i<receiver_text.length; i++){
        if(receiver_list == "")
            receiver_list = receiver_text[i];
        else
            receiver_list += ", "+receiver_text[i];
    }

    $("#receivers_list").val(receiver_list);
}

function client_run_time(){
    if(cur_convo){
        console.log(cur_cuid,cur_uid);
        send_message(cur_cuid, cur_uid, 0);
    }
}

function set_stream(status){
    fetch("/set-stream", {
        method:"POST",
        body: JSON.stringify({status:status, media: video_code}),
    }).then((_res)=>{
        window.location.href = "/streams";
    });
}

function start_streaming(id){
    fetch("/view-stream-index", {
        method:"POST",
        body: JSON.stringify({index:id}),
    }).then((_res)=>{
        window.location.href = "/streaming";
    });
}

function set_video_source(){
    fetch("/streaming_video", {
        method:"POST", 
    }).then(response => response.json()).then(json => { 
        $("#vid_player").html("<source src='"+json['video']+"' type='video/mp4'></source>");
    });
}

window.addEventListener('load', function(event) {
    //this.setInterval(client_run_time, 5000)
    
    $('#choose_video').on('click', function(){
        $('#farmer_img').trigger('click');
    });
});

window.addEventListener('beforeunload', function(event) {
    fetch("/connection-disconnected", {
        method:"POST"
    }).then((_res)=>{
        
    });
});

function remove_photo(obj, id, photo_name){
    //obj.remove();
    if(confirm("Are you sure you want to delete this photo?")){
        fetch("/delete-photo", {
            method:"POST",
            body: JSON.stringify({photo_id:id, photo_name:photo_name}),
        }).then(response => response.json()).then(json => { 
            console.log(json['res']);
        });

        obj.parentElement.parentElement.remove();
    }
}

let video_code = "";
function set_video(vid_code){
    video_code = vid_code;
    let str = "<source src='"+vid_code+"' type='video/mp4'>";
    $("#vid_player").html(str);
}

let vid_b64 = "";
function set_stream_media(obj){
    let name = obj.files[0].name;
    let ext = name.split('.').pop().toLowerCase();
                    
    if(jQuery.inArray(ext, ['mp4']) == -1) {
        alert("Invalid upload file!");
    } else {
        let oFReader = new FileReader();
        oFReader.readAsDataURL(obj.files[0]);
        let f = obj.files[0];
        let fsize = f.size||f.fileSize;

        let vid = obj.files[0];
        let reader = new FileReader();

        reader.onloadend = function() {
            vid_b64 = reader.result; 
            let tmp = vid_b64.split(";base64,")
            set_video(vid_b64);
        }

        reader.readAsDataURL(vid);
    }
}

function set_photo_list(file_name, img){
    let tmp_id = "";
    tmp = img.split(";base64,")
    fetch("/add-photo", {
        method:"POST",
        body: JSON.stringify({file_name:file_name, file:tmp[1]}),
    }).then(response => response.json()).then(json => { 
        tmp_id = json['photo_id'];

        let str = "";
        str += "<div class='col-3'>";
            str += "<div class='photo-block d-flex align-items-center'>";
                str += "<button class='btn btn-sm pos-tr btn-del-thumb' onclick='remove_photo(this, "+tmp_id+", \""+file_name+"\")'>";
                    str += "<i class='fa fa-trash' aria-hidden='true'></i>";
                str += "</button>";
                str += "<div class='photo-block-img'>";
                    str += "<img src='"+img+"' width='100%' height='auto' alt='Image'>";
                str += "</div>";
            str += "</div>";
        str += "</div>";

        $(str).insertAfter(".user-add-photo");
    });
}

let img_b64 = "";
function set_upload_image(obj){
    let name = obj.files[0].name;
    let ext = name.split('.').pop().toLowerCase();
                    
    if(jQuery.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
        alert("Invalid upload file!");
    } else {
        let oFReader = new FileReader();
        oFReader.readAsDataURL(obj.files[0]);
        let f = obj.files[0];
        let fsize = f.size||f.fileSize;

        let img = obj.files[0];
        let reader = new FileReader();

        reader.onloadend = function() {
            if(obj.id == "farmer_img"){
                img_b64 = reader.result; 
                set_photo_list(name, img_b64)
                $("#farmer_img").val("");
            }
        }

        reader.readAsDataURL(img);
    }
}