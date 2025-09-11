async function LoadData() {
    let response = await fetch('http://localhost:3000/posts');
    let posts = await response.json();
    let body = document.getElementById("posts-table-body");
    body.innerHTML = ""; // Xóa dữ liệu cũ trước khi load mới
    for (const post of posts) {
        body.innerHTML += convertDataToHTML(post);
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
    let id = document.getElementById("id").value;
    let title = document.getElementById("title").value;
    let views = document.getElementById("views").value;
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
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'DELETE'
        });
        let response = await res.json();
        console.log('Success:', response);
        await LoadData(); // Reload bảng sau khi xóa
    } catch (error) {
        console.error('Error:', error);
    }
}