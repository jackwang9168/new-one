<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// --- State for Profile Data ---
const username = ref('玩家001');
const phone = ref('138****8888'); // Keep masked for display
const registrationDate = ref('2023-01-01');
const gamesPlayed = ref(128); // Could be calculated from W+L+D
const winRate = ref(65); // Could be calculated

// --- NEW Enhanced Profile Data ---
const eloRating = ref(1650);
const rankTitle = ref('棋师'); // Calculated based on ELO
const wins = ref(83);
const losses = ref(40);
const draws = ref(5);
const highestWinStreak = ref(12);
const bio = ref('热爱象棋，以棋会友！'); // Editable
const location = ref('广西桂林'); // Editable
const userId = ref('UID-a1b2c3d4e5'); // Usually non-editable
const lastLogin = ref('2024-03-15 10:30'); // Usually system-updated
const achievementsUnlocked = ref(25); // Example count

// --- State for Editing Mode ---
const isEditing = ref(false);

// --- Temporary Refs for Edits ---
const editedUsername = ref('');
const editedPhone = ref(''); // Might need separate logic for editing phone (verification)
const editedBio = ref('');
const editedLocation = ref('');

// --- Navigation ---
const navigateTo = (path) => {
  router.push(path);
};

// --- 新增：返回上一页的函数 ---
const goBack = () => {
  router.back();
};

// --- Placeholder Navigation/Actions ---
const viewMatchHistory = () => {
  console.log('Navigating to match history...');
  // router.push('/match-history'); // Example navigation
  alert('功能暂未开放：查看对战历史');
};

const viewAchievements = () => {
  console.log('Navigating to achievements...');
  // router.push('/achievements'); // Example navigation
  alert('功能暂未开放：查看成就');
};


// --- Edit Logic ---
const startEditing = () => {
  editedUsername.value = username.value;
  editedPhone.value = phone.value; // Consider fetching unmasked phone if editing allowed
  editedBio.value = bio.value;
  editedLocation.value = location.value;
  isEditing.value = true;
};

const saveChanges = () => {
  // --- Placeholder for actual save logic ---
  // In a real app, send data to your backend API
  console.log('Saving changes:', {
    username: editedUsername.value,
    phone: editedPhone.value, // Handle phone update carefully
    bio: editedBio.value,
    location: editedLocation.value,
  });

  // --- Update the main refs with edited values ---
  username.value = editedUsername.value;
  phone.value = editedPhone.value; // Update display phone (might need re-masking)
  bio.value = editedBio.value;
  location.value = editedLocation.value;

  isEditing.value = false;
  // Optionally: show a success message
  alert('信息已保存！'); // Simple feedback
};

const cancelEdit = () => {
  isEditing.value = false;
};
</script>

<template>
  <div class="profile-container">
    <nav class="navbar">
      <div class="nav-brand">象棋游戏</div>
      <div class="nav-links">
        <a @click="navigateTo('/home')">首页</a>
        <a @click="navigateTo('/profile')" class="active">个人信息</a>
        <a @click="navigateTo('/rankings')">排行榜</a>
        <a @click="navigateTo('/settings')">设置</a>
      </div>
    </nav>

    <main class="main-content">
       <!-- 新增：返回按钮 -->
       <button @click="goBack" class="back-btn top-left-back-btn">返回</button>
      <h1>个人信息</h1>
      <div class="profile-info">
        <!-- Avatar Section -->
        <div class="avatar-section">
          <div class="avatar">
            <img src="../pictures/2.webp" alt="用户头像">
          </div>
          <!-- Add Edit Avatar Button/Logic if needed -->
        </div>

        <!-- Info Section -->
        <div class="info">
          <!-- Display Mode -->
          <template v-if="!isEditing">
            <h2>{{ username }}</h2>
            <p><strong>用户ID：</strong> {{ userId }}</p>
            <p><strong>手机号：</strong> {{ phone }}</p>
            <p><strong>所在地：</strong> {{ location }}</p>
            <p><strong>个性签名：</strong> {{ bio }}</p>
            <hr>
            <h3>棋力统计</h3>
            <p><strong>等级分：</strong> {{ eloRating }} ({{ rankTitle }})</p>
            <p><strong>总对局：</strong> {{ gamesPlayed }} （胜 {{ wins }} / 负 {{ losses }} / 和 {{ draws }}）</p>
            <p><strong>胜率：</strong> {{ winRate }}%</p>
            <p><strong>最高连胜：</strong> {{ highestWinStreak }}</p>
            <hr>
            <h3>账户信息</h3>
            <p><strong>注册时间：</strong> {{ registrationDate }}</p>
            <p><strong>上次登录：</strong> {{ lastLogin }}</p>
            <p><strong>已获成就：</strong> {{ achievementsUnlocked }} 个</p>
          </template>

          <!-- Edit Mode -->
          <template v-else>
            <h2>编辑信息</h2>
            <div class="form-group">
              <label for="username">用户名：</label>
              <input id="username" v-model="editedUsername" type="text">
            </div>
             <div class="form-group">
              <label for="phone">手机号：</label>
              <input id="phone" v-model="editedPhone" type="tel" placeholder="（谨慎修改）">
            </div>
             <div class="form-group">
              <label for="location">所在地：</label>
              <input id="location" v-model="editedLocation" type="text">
            </div>
             <div class="form-group form-group-textarea">
              <label for="bio">个性签名：</label>
              <textarea id="bio" v-model="editedBio" rows="3"></textarea>
            </div>
            <hr>
            <!-- Display non-editable stats even in edit mode -->
            <h3>棋力统计（不可编辑）</h3>
            <p><strong>用户ID：</strong> {{ userId }}</p>
            <p><strong>等级分：</strong> {{ eloRating }} ({{ rankTitle }})</p>
            <p><strong>总对局：</strong> {{ gamesPlayed }} （胜 {{ wins }} / 负 {{ losses }} / 和 {{ draws }}）</p>
             <p><strong>注册时间：</strong> {{ registrationDate }}</p>
             <p><strong>上次登录：</strong> {{ lastLogin }}</p>
          </template>

          <!-- Action Buttons -->
          <div class="action-buttons">
             <!-- Buttons visible in display mode -->
             <template v-if="!isEditing">
                <button @click="startEditing" class="btn btn-edit">修改信息</button>
                <button @click="viewMatchHistory" class="btn btn-secondary">查看对战历史</button>
                <button @click="viewAchievements" class="btn btn-secondary">查看成就</button>
             </template>
             <!-- Buttons visible in edit mode -->
             <template v-else>
              <button @click="saveChanges" class="btn btn-save">保存</button>
              <button @click="cancelEdit" class="btn btn-cancel">取消</button>
            </template>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* --- Existing Styles (Navbar, Container etc. - Keep As Is) --- */
.profile-container {
  width: 100vw;
  height: 100vh;
  background-image: url('../pictures/3.webp');
  background-size: cover; /* Use cover for better scaling */
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* 新增：为绝对定位的子元素提供基准 */
  position: relative;
}

.navbar {
  background-color: rgba(51, 51, 51, 0.4); /* Slightly more opaque */
  padding: 1rem 1.5rem; /* More padding */
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.nav-brand {
  color: white;
  font-size: 1.6rem; /* Slightly larger */
  font-weight: bold;
  margin-right: auto;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.3); /* Add subtle shadow */
}

.nav-links {
  display: flex;
  gap: 1.2rem; /* More gap */
  margin-right: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  cursor: pointer;
  padding: 0.6rem 1.2rem; /* Adjust padding */
  border-radius: 5px; /* Slightly more rounded */
  transition: all 0.3s ease;
  position: relative;
  font-size: 1.05rem; /* Slightly larger font */
}

.nav-links a:hover {
  background-color: rgba(85, 85, 85, 0.75);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: white;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-links a:hover::after {
  width: 70%; /* Adjust width */
}

.nav-links a.active {
  background-color: rgba(175, 76, 147, 0.7); /* More intense active color */
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
}

.nav-links a.active::after {
  width: 70%; /* Match hover */
  background-color: white;
}

/* --- Main Content & Profile Specific Styles --- */
.main-content {
  flex: 1;
  padding: 2rem 2.5rem; /* More padding */
  max-width: 1000px; /* Adjusted max-width */
  width: 85%; /* Adjust width */
  margin: 2.5rem auto; /* More margin top/bottom */
  background-color: rgba(255, 255, 255, 0.35); /* More opaque */
  border-radius: 15px; /* More rounded */
  backdrop-filter: blur(6px); /* Increased blur */
  color: rgba(0, 0, 0, 0.9); /* Darker text */
  box-shadow: 0 6px 20px rgba(0,0,0,0.15); /* Enhanced shadow */
  overflow-y: auto; /* Ensure content scrolls if too long */
  /* 新增：如果按钮放在这里，也需要相对定位 */
  position: relative;
}

h1 {
  /* 新增：为按钮留出空间 */
  margin-top: 3rem;
  margin-bottom: 2rem; /* More spacing */
  color: rgba(0, 0, 0, 0.9);
  text-align: center;
  font-weight: 600;
  font-size: 2.2rem; /* Larger title */
}

h2 {
    margin-top: 0;
    margin-bottom: 1.2rem;
    font-size: 1.6rem;
    color: #333;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    padding-bottom: 0.5rem;
}

h3 {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    color: #555;
}

hr {
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.15);
    margin: 1.5rem 0;
}


.profile-info {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem; /* Increased gap */
  margin-top: 1rem; /* Reduced top margin as h1 has more bottom margin */
  align-items: flex-start;
}

.avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    flex-basis: 150px; /* Give avatar section a base width */
    flex-shrink: 0;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.6); /* Thicker border */
  box-shadow: 0 4px 10px rgba(0,0,0,0.25);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  flex: 1;
  min-width: 300px; /* Ensure info section doesn't get too small */
}

.info p, .form-group {
  margin-bottom: 0.8rem; /* Fine-tune spacing */
  font-size: 1.05rem; /* Slightly larger base font */
  line-height: 1.6;
}

.info strong, .form-group label {
    display: inline-block; /* Ensures consistent layout */
    min-width: 90px; /* Adjust label width */
    font-weight: 600;
    color: rgba(0, 0, 0, 0.75);
    margin-right: 0.5rem; /* Space between label and value/input */
    vertical-align: top; /* Align labels top for multiline textareas */
}
.info strong {
    color: rgba(0, 0, 0, 0.65); /* Slightly lighter label in display mode */
}


/* Edit Mode Styles */
.form-group {
    display: flex;
    align-items: center; /* Align label and input vertically */
    gap: 0.5rem;
    flex-wrap: wrap; /* Allow wrapping if needed */
}
.form-group.form-group-textarea {
    align-items: flex-start; /* Align label top for textarea */
}

.form-group label {
    flex-shrink: 0;
}

.form-group input[type="text"],
.form-group input[type="tel"],
.form-group textarea {
    flex-grow: 1;
    padding: 0.7rem 1rem; /* More padding in inputs */
    border: 1px solid rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.8); /* More opaque input background */
    font-size: 1rem;
    color: #222; /* Darker input text */
    transition: border-color 0.3s, box-shadow 0.3s;
    min-width: 200px; /* Prevent inputs from becoming too small */
}
.form-group textarea {
    resize: vertical; /* Allow vertical resize */
    min-height: 80px; /* Minimum height for textarea */
}

.form-group input[type="text"]:focus,
.form-group input[type="tel"]:focus,
.form-group textarea:focus {
    outline: none;
    border-color: rgba(175, 76, 147, 0.9);
    box-shadow: 0 0 0 3px rgba(175, 76, 147, 0.25);
}

/* Action Buttons */
.action-buttons {
  margin-top: 2.5rem; /* More space above buttons */
  display: flex;
  flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
  gap: 1rem;
}

.btn {
  padding: 0.8rem 1.8rem; /* Larger buttons */
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
  text-align: center;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
.btn:active {
    transform: translateY(0px);
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.btn-edit {
  background-color: #4a90e2;
  color: white;
}
.btn-edit:hover { background-color: #3a7bc8; }

.btn-save {
  background-color: #50e3c2;
  color: #333;
}
.btn-save:hover { background-color: #38c9a8; }

.btn-cancel {
  background-color: #f5a623;
  color: white;
}
.btn-cancel:hover { background-color: #d9901f; }

.btn-secondary {
  background-color: #777;
  color: white;
}
.btn-secondary:hover { background-color: #666; }

/* 新增：返回按钮样式 */
.back-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  background-color: rgba(100, 100, 100, 0.6); /* 中性灰色 */
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.back-btn:hover {
  background-color: rgba(120, 120, 120, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
}

/* 新增：返回按钮定位（左上角） */
.top-left-back-btn {
  position: absolute;
  top: 1.5rem; /* 根据需要调整 */
  left: 1.5rem; /* 根据需要调整 */
  z-index: 10; /* 确保在其他元素之上 */
}
</style>