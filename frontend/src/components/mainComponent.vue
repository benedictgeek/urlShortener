<template>
  <div>
    <header class="main-header">
      <div class="main-header__brand">
        <a href="index.html">shRt</a>
      </div>
      <nav class="main-header__nav">
        <ul class="main-header__nav--lists">
          <li class="main-header__nav--list">
            <a href="about.html">About</a>
          </li>
        </ul>
      </nav>
    </header>
    <main>
      <section class="main-input">
        <h3 class="main-input__title">Please paste your Url here</h3>
        <input type="text" name="url" id="url" v-model="url" />
        <button id="shrtButton" type="submit" @click="shortenUrl()">Go</button>
        <h3 class="main-output__intro">Your Shortened url is</h3>
        <a class="main-output__url" :href="responseData.data.shortenedUrl">{{responseData.data.shortenedUrl}}</a>
      </section>
    </main>
    <footer class="main-footer">
      <nav class="main-footer__nav">
        <ul class="main-footer__nav--lists">
          <li class="main-footer__nav--list">
            <a>How To</a>
          </li>
          <li class="main-footer__nav--list">
            <a>About Us</a>
          </li>
        </ul>
      </nav>
      <h5 class="copywrite">Copywrite @2019</h5>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "",
      responseData: { data: {
          shortenedUrl: "",
          origibalUrl: ""
      }}
    };
  },
  methods: {
    shortenUrl() {
      let is_url = (url) => {
        const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        const newRegEx = new RegExp(regexp);
        if (newRegEx.test(url)) {
          return true;
        } else {
          return false;
        }
      }

      if(is_url(this.url)) {
          fetch("http://127.0.0.1:2000/api/url/shrt", {
            method: "POST",
            body: JSON.stringify({
              url: this.url
            }),
            headers: { Accept: "application/json" }
          }).then(result => {
            return result.json()
          })
          .then(resData => {
            this.responseData = resData;
          })
      }

    },
    redirect() {
        // extract the the redirect url id from the url
        const href = window.location.href.substr(22);
        fetch("http://127.0.0.1:2000/" + href, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain',
            }
        })
        .then(res => {
            return res.json()
        })
        .then(resData => {
            if(resData.statusCode == 200) {
                let redirectUrl = resData.originalUrl;
                //check if url has http/https 
                if(resData.originalUrl.substring(0, 8).trim() != 'http://' || 'https://') {
                    redirectUrl = 'https://' + redirectUrl
                }
                return window.location.href = redirectUrl;
            }
        })
        .catch(err => {
            // alert(err);
        })
    }
  },
  mounted() {
      this.redirect();
  }
};
</script>

