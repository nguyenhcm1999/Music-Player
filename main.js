const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PlAYER_STORAGE_KEY = 'F8_PLAYER'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn =$('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const editBar = $('.editbar')

const volumeBar = $('.volumebar')
const volumeBtn = $('.btn-volume')
const volumePanel = $('.volume-panel')
const volume = $('#volume')
const volumemuted = $('.volume-muted')
const volumedown = $('.volume-down')
const volumemedium = $('.volume-medium')
const volumeup = $('.volume-up')

const currentTime = $('.current-time')
const audioTime = $('.audio-duration')

const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn =$('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

volumemuted.style.display ='none'
volumedown.style.display ='none'
volumemedium.style.display ='none'

const app ={
    isPlaying : false,
    isRandom : false,
    isRepeat: false,
    currentIndex: 0,
    
    // chuyển chuỗi String trong localStorage thành Object
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    // localStorage.getItem(PlAYER_STORAGE_KEY) cũng chính là JSON.stringify(this.config)
    songs: [  
        {
          name: "Vì Mẹ Anh Bắt Chia Tay",
          singer: "Miu Lê x Karik",
          path: "./assets/music/ViMeAnhBatChiaTay-MiuLeKarikChauDangKhoa-7479220.mp3",
          image: "./assets/img/Loi-bai-hat-Vi-Me-Anh-Bat-Chia-Tay.jpg"
        },
        {
          name: "Hai mươi hai(22)",
          singer: "Hứa Kim Tuyền, AMEE",
          path: "./assets/music/HaiMuoiHai22-HuaKimTuyenAMEE-7231237.mp3",
          image:"./assets/img/b6de6c0857b19e1c921f2d379817d491.jpg"
        },
        {
          name: "Cứ Thở Đi",
          singer: "Đức Phúc x Juky San",
          path:"./assets/music/CuThoDi-DucPhucJukySan-7205846.mp3",
          image: "./assets/img/photo-1-16520951252081250658255.jpg"
        },
        {
          name: "Tình Bạn Diệu Kỳ",
          singer: "Ricky Star x Lăng LD x Amee",
          path: "./assets/music/TinhBanDieuKyMasewRemix-AMee-6942490.mp3",
          image:"./assets/img/maxresdefault.jpg"
        },
        {
          name: "Do For Love",
          singer: "Amee",
          path: "./assets/music/DoForLove-AMeeBRay-6221980.mp3",
          image:"./assets/img/b58e0094f0cfac1b54f36a9cf6d8c3f3.500x500x1.jpg"
        },
        {
          name: "Em Bé",
          singer: "Amee x Karik",
          path:
            "./assets/music/EmBe-AMEEKarik-6719970.mp3",
          image:
            "./assets/img/embe.jpg"
        },
        {
          name: "Ex Hate Me",
          singer: "Amee x Bray",
          path: "./assets/music/ExsHateMe-BRayMasewAMee-5878683.mp3",
          image:
            "./assets/img/133eba671d414ae36f5aa9f3933094d6.jpg"
        }
      ],

    setConfig: function(key,value){
        // thêm thuộc tính cho app.config
        this.config[key] = value;
        // this.config['isRandom'] = _this.isRandom
        
        for (let prop in this.config){console.log(prop)} //isRandom, isRepeat

        // LocalStorage chỉ cho phép lưu biến với kiểu string, nên muốn lưu Object
        // hoặc Array thì cần covert sang Json. this.config từ Object thành String
        // do vậy value của PlAYER_STORAGE_KEY là chuỗi string {isRandom: true, isRepeat: true}
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config)) 
        // _this.setConfig('isRandom',_this.isRandom)
        
        // this.isRandom = this.config.isRandom
        // if ( typeof(Storage) !== "undefined") {

        //     localStorage.clear();
           
        //     alert('Đã xóa thành công');
           
        //    }
    },


      //${index === this.currentIndex ? 'active' : ''}
    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class="song" data-index=${index}>
                <div class="thumb-div">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="caption">
                        <div class="blur">
                        </div>
                    </div>
                    <div class="btn-play-mini" style="margin-left: 3px; display:">
                        <i class="fas fa-play"></i>
                    </div>  
                </div>

                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `;
        });
// htmls return thành 1 mảng có chứa những chuỗi chứa đoạn html tạo thành
// 1 bài hát, muốn chuyển đổi mảng đó thành 1 chuỗi duy nhất để đưa đoạn
// html vào thẻ div có class là playlist thì dùng join
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function(){
// Phương thức defineProperty cho phép khai báo thuộc tính mới, hoặc thay
// đổi một thuộc tính đã có của object bằng cách dùng property descriptors
// Phương thức này chỉ cho phép thay đổi 1 thuộc tính duy nhất

        Object.defineProperty(this,'currentSong',{
            //get đặc tính là không phải mở ngoặc là hàm
            get : function(){
                // console.log(this.songs[this.currentIndex])
                return this.songs[this.currentIndex]
            }
        })
        
    },

    handleEvents:function(){
        const _this = this
        const cdWidth = cd.offsetWidth
        audio.muted = false
        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform:'rotate(0deg)'},
            {transform:'rotate(360deg)'}
        ],{
            duration: 10000, //10 second
            iterations: Infinity
        })

        cdThumbAnimate.pause()

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCDwidth = cdWidth - scrollTop
            cd.style.width = newCDwidth > 0 ? newCDwidth + 'px' : 0
            // console.log(newCDwidth) 
            // console.log(scrollTop)
            cd.style.opacity = newCDwidth / cdWidth
        }

        // Xử lý khi click play
        playBtn.onclick = function(){
            // Khi click vào playBtn, isPlaying là false, và nó sẽ chạy 
            // Khi chạy isPlaying đổi thành true, lặp lại khi click vào playBtn
            if (_this.isPlaying){
            audio.pause()
            }else{
            audio.play()
            }
            // _this.setConfig('isPlaying',_this.isPlaying)
        }

        // Khi song được play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }    
        
        // Khi song bị pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if (audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value  = progressPercent

                var x = progress.value;
                var color = 'linear-gradient(90deg, rgb(236,31,85)'+ x + '%, rgb(252,120,155)' + x +'%)'
                progress.style.background = color
            }

            // Cập nhật thời gian hiện tại
            // console.log(audio.currentTime)
            var currenthours = Math.floor(audio.currentTime / 3600)
            var currentminutes = Math.floor(audio.currentTime/ 60 % 60)
            var currentseconds = Math.floor(audio.currentTime % 60)
            if ((audio.currentTime >= 600) && ( minutes < 10)){
                minutes = '0' + minutes
            }
            currentTime.textContent = `${currenthours ? currenthours+':' : ''}${currentminutes}:${currentseconds >= 10 ? currentseconds : '0' + currentseconds }`             
        }

        // Xử lý khi tua song
        progress.oninput = function(e){
            const seekTime =e.target.value * audio.duration / 100
            audio.currentTime = seekTime

            var x = progress.value;
            var color = 'linear-gradient(90deg, rgb(236,31,85)'+ x + '%, rgb(252,120,155)' + x +'%)'
            progress.style.background = color
        }

        // Xử lý khi chạm vào nút âm lượng
        volumeBtn.addEventListener('mouseenter',function(){
            volumePanel.style.margin = '0px 0px 0px 0px';
            volumePanel.style.width = '100px';
            // volumeBar.style.width = '115px';
            // volumeBar.style.margin = '0 5px 0 0';
            volumePanel.style.transition = 'all 0.2s ease'
        })

        editBar.addEventListener('mouseleave',function(){
            volumePanel.style.margin = '0px 0px 0px 0px';
            volumePanel.style.width = '0px';
            // volumeBar.style.width = '0px';
            // volumeBar.style.margin = '0 30px 0 0';
            volumePanel.style.transition = 'all 0.2s ease'
        })

        // Xử lý khi click vào nút âm lượng
        volumeBtn.addEventListener('click', function(){
            audio.muted = !audio.muted;
            if(audio.muted) {
                
                volumemuted.style.display = ''
                volumedown.style.display = 'none'
                volumemedium.style.display = 'none'
                volumeup.style.display = 'none'
                volume.value = 0
            } else {
                volume.value = audio.volume * 100

                if(audio.volume <= 0.25) {
                    volumemuted.style.display = 'none'
                    volumedown.style.display = ''
                    volumemedium.style.display = 'none'
                    volumeup.style.display = 'none'
                } else if(audio.volume <= 0.5) {
                    volumemuted.style.display = 'none'
                    volumedown.style.display = 'none'
                    volumemedium.style.display = ''
                    volumeup.style.display = 'none'
                } else if(audio.volume > 0.5) {
                    volumemuted.style.display = 'none'
                    volumedown.style.display = 'none'
                    volumemedium.style.display = 'none'
                    volumeup.style.display = ''
                }
                
            }
        })
        
        // Xử lý khi tăng giảm âm lượng
        volume.addEventListener('input', function(e){
            var x = volume.value;
            var color = 'linear-gradient(90deg, rgb(236,31,85)'+ x + '%, rgb(252,120,155)' + x +'%)'
            volume.style.background = color
            audio.volume = volume.value/ 100
            // console.log(audio.volume)
            
            if(volume.value <= 0) {
                volumemuted.style.display = ''
                volumedown.style.display = 'none'
                volumemedium.style.display = 'none'
                volumeup.style.display = 'none'
            } else if(volume.value <= 25){
                volumemuted.style.display = 'none'
                volumedown.style.display = ''
                volumemedium.style.display = 'none'
                volumeup.style.display = 'none'
            } else if(volume.value <= 50){ 
                volumemuted.style.display = 'none'
                volumedown.style.display = 'none'
                volumemedium.style.display = ''
                volumeup.style.display = 'none'
            } else if(volume.value > 50){
                volumemuted.style.display = 'none'
                volumedown.style.display = 'none'
                volumemedium.style.display = 'none'
                volumeup.style.display = ''
            } 
        },false)

        setInterval(function(){
            var x = volume.value;
            var color = 'linear-gradient(90deg, rgb(236,31,85)'+ x + '%, rgb(252,120,155)' + x +'%)'
            volume.style.background = color

            if(audio.readyState > 0) {
                var hours = Math.floor(audio.duration / 3600)
                var minutes = Math.floor(audio.duration/ 60 % 60)
                var seconds = Math.floor(audio.duration % 60)
                if ((audio.duration >= 600) && ( minutes < 10)){
                    minutes = '0' + minutes
                }
                audioTime.textContent = `${hours ? hours+':' : ''}${minutes}:${seconds >= 10 ? seconds : '0' + seconds }`            
            }
        })

        
        // Khi next song 
        nextBtn.onclick = function(){
            if(_this.isRandom){
                // console.log(_this.isRandom)
                _this.playRandomSong()
            } else {
                // console.log(_this.isRandom)
                _this.nextSong()
            }
            audio.play()
            // _this.render()
            // _this.scrollToActiveSong()
            setTimeout(function(){
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block:'end',
                })
            }, 100)
        }
        
        // Khi pre song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            // _this.render()
            setTimeout(function(){
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block:'end',
                })
            }, 300)
            
        }

        // Xử lý bật / tắt random song 
        randomBtn.onclick = function(){
            // console.log(_this.isRandom)
            _this.isRandom = !_this.isRandom
            // console.log(_this.isRandom)
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
            
        }

        // Xử lý lặp lại một song
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            
        // closet trả về chính nó hoặc là thẻ cha của nó, nếu k tìm thấy trả về null
            if (songNode|| e.target.closest('.option')) {
                // Xử lý khi click vào song
               if(songNode){
                // console.log(songNode.getAttribute('data-index'))
                // console.log(songNode.dataset.index)
                _this.currentIndex = songNode.dataset.index
                _this.loadCurrentSong()
                audio.play()
               }

               // Xử lý khi click vào song option
               if(e.target.closest('.option')){

            }
            }
        }
    },

    // scrollToActiveSong: function(){
    //     setTimeout(function(){
    //         $('.song.active').scrollIntoView({
    //             behavior: 'smooth',
    //             block:'center',
    //         })
    //     }, 300)
    // },

    loadCurrentSong: function(){
        let playlistSongs =$$('.song')
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        for (let i = 0; i < playlistSongs.length; i++) {
            playlistSongs[i].classList.remove('active')
        }       

        playlistSongs[this.currentIndex].classList.add('active')
        
        // console.log(playlistSongs)
        // console.log(heading, cdThumb, audio)
        // console.log(this.songs.length) 
        // Thời lượng music
        if(audio.readyState > 0) {
                var hours = Math.floor(audio.duration / 3600)
                console.log(hours)
                var minutes = Math.floor(audio.duration/ 60 % 60)
                console.log(minutes)
                var seconds = Math.floor(audio.duration % 60)
                console.log(seconds)
                console.log(audioTime.textContent)
                audioTime.textContent = `${hours}:${minutes}:${seconds}`            
            }
    },

    loadConfig: function(){
        
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    
    prevSong: function(){
        this.currentIndex --
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
    } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function(){
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        // Định nghĩa các thuộc tính cho object, từ currentIndex lấy ra phần tử 
        // đầu tiên để xử lý
        this.defineProperties()

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()

        // Render playlists
        this.render()    
        
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)

    }
}

app.start()