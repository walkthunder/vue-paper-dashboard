<template>
  <div class="card login-card">
    <input placeholder="username" class="input" id="username"/>
    <input placeholder="code" class="input" />
    <button id="btn">登录</button>
  </div>
</template>
<script></script>
<style>
  .login-card {
    position: absolute;
    top: 300px;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    text-align: center;
    width: 300px;
  }
  .input {
    display: block;
    outline: none;
    padding: 2px;
    margin: 0 auto;
    width: 250px;
  }
  #username {
    margin-bottom: 20px;
  }
  #btn {
    margin-top: 20px;
  }
</style>
