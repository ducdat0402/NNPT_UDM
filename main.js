async function LoadData() {
    let response = await fetch('http://localhost:3000/posts');
    let posts = await response.json();
    let body = document.getElementById("posts-table-body");
    body.innerHTML = ""; // Xóa dữ liệu cũ trước khi load mới
    for (const post of posts) {
        if (post.isDelete !== "true") { // Chỉ hiển thị bài chưa bị xóa
            body.innerHTML += convertDataToHTML(post);
        }
    }
}

function convertDataToHTML(post) {
    let result = "<tr>";
    result += "<td>" + post.id + "</td>";
    result += "<td>" + post.title + "</td>";
    result += "<td>" + post.views + "</td>";
    result += `<td><button onclick="Delete('${post.id}')">Delete</button></td>`;
    result += "</tr>";
    return result;
}

console.log("Hello from main.js");

// Save data to json-server
async function SaveData() {
    let idInput = document.getElementById("id").value;
    let title = document.getElementById("title").value;
    let views = document.getElementById("views").value;

    let id = idInput;
    if (!idInput) {
        // Nếu không nhập id, tự động tăng id
        let response = await fetch('http://localhost:3000/posts');
        let posts = await response.json();
        let maxId = posts.reduce((max, post) => Math.max(max, Number(post.id)), 0);
        id = String(maxId + 1);
    }

    let dataObj = { id, title, views };

    try {
        let res = await fetch('http://localhost:3000/posts/' + id);
        let fetchOptions = {
            method: res.ok ? 'PUT' : 'POST',
            body: JSON.stringify(dataObj),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let url = res.ok ? 'http://localhost:3000/posts/' + id : 'http://localhost:3000/posts';
        let saveRes = await fetch(url, fetchOptions);
        let response = await saveRes.json();
        console.log('Success:', response);
        await LoadData(); // Reload bảng sau khi lưu
    } catch (error) {
        console.error('Error:', error);
    }
}

async function Delete(id) {
    try {
        // Lấy dữ liệu bài viết hiện tại
        let res = await fetch('http://localhost:3000/posts/' + id);
        let post = await res.json();
        // Thêm trường isDelete: "true"
        post.isDelete = "true";
        // Gửi yêu cầu cập nhật
        await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            body: JSON.stringify(post),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await LoadData(); // Reload bảng sau khi "xóa mềm"
    } catch (error) {
        console.error('Error:', error);
    }
}