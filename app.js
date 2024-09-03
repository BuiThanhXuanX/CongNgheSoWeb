// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyASRtgLWk_QcQwWWKmEjDzFBQJw66umMt0",
  authDomain: "congnghemoi-1c900.firebaseapp.com",
  projectId: "congnghemoi-1c900",
  storageBucket: "congnghemoi-1c900.appspot.com",
  messagingSenderId: "430036418539",
  appId: "1:430036418539:web:0afc1d1228cf310c92a3ae",
  measurementId: "G-KV3CCBKT4F"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Tải bài viết từ Firestore và hiển thị theo thời gian thực
function loadArticles() {
  const articleList = document.getElementById('article-list');
  articleList.innerHTML = ''; // Xóa nội dung cũ trước khi tải mới

  // Lắng nghe sự thay đổi dữ liệu theo thời gian thực
  db.collection('articles').orderBy('timestamp', 'desc').onSnapshot((querySnapshot) => {
    articleList.innerHTML = '';  // Xóa nội dung cũ trước khi tải mới
    querySnapshot.forEach((doc) => {
      const article = doc.data();
      const articleId = doc.id; // Lấy ID của tài liệu

      // Thêm bài viết với nút xóa
      articleList.innerHTML += `
        <div id="${articleId}">
          <h3>${article.title}</h3>
          <p>${article.content}</p>
          <button onclick="deleteArticle('${articleId}')">Xóa</button>
        </div>`;
    });
  }, (error) => {
    console.error("Lỗi khi lấy dữ liệu: ", error);
    articleList.innerHTML = '<p>Không thể tải bài viết. Vui lòng thử lại sau.</p>';
  });
}

// Thêm bài viết mới
document.getElementById('update-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();

  // Kiểm tra nếu title và content không rỗng
  if (title === "" || content === "") {
    alert("Vui lòng điền đầy đủ thông tin trước khi đăng bài.");
    return;
  }

  db.collection('articles').add({
    title: title,
    content: content,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert('Bài viết đã được thêm!');
    document.getElementById('update-form').reset();  // Reset form sau khi đăng bài
  }).catch((error) => {
    console.error("Lỗi khi thêm bài viết: ", error);
    alert('Lỗi khi thêm bài viết. Vui lòng thử lại.');
  });
});

// Xóa bài viết
function deleteArticle(articleId) {
  if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
    db.collection('articles').doc(articleId).delete()
    .then(() => {
      alert("Bài viết đã được xóa.");
    })
    .catch((error) => {
      console.error("Lỗi khi xóa bài viết: ", error);
      alert("Lỗi khi xóa bài viết. Vui lòng thử lại.");
    });
  }
}

// Gọi hàm loadArticles khi trang được tải
window.onload = loadArticles;
