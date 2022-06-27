const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn =$('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn =$('.btn-random')
const repeatBtn = $('.btn-repeat')


const app ={
    isPlaying : false,
    isRandom : false,
    isRepeat: false,
    currentIndex: 0,
    songs: [  
        {
          name: "Vì Mẹ Anh Bắt Chia Tay",
          singer: "Miu Lê x Karik",
          path: "./assets/music/ViMeAnhBatChiaTay-MiuLeKarikChauDangKhoa-7479220.mp3",
          image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
          name: "Hai mươi hai(22)",
          singer: "Hứa Kim Tuyền, AMEE",
          path: "./assets/music/HaiMuoiHai22-HuaKimTuyenAMEE-7231237.mp3",
          image:
            "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
          name: "Naachne Ka Shaunq",
          singer: "Raftaar x Brobha V",
          path:
            "./assets/music/ViMeAnhBatChiaTay-MiuLeKarikChauDangKhoa-7479220.mp3",
          image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
          name: "Mantoiyat",
          singer: "Raftaar x Nawazuddin Siddiqui",
          path: "./assets/music/ViMeAnhBatChiaTay-MiuLeKarikChauDangKhoa-7479220.mp3",
          image:
            "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
          name: "Aage Chal",
          singer: "Raftaar",
          path: "./assets/music/ViMeAnhBatChiaTay-MiuLeKarikChauDangKhoa-7479220.mp3",
          image:
            "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        // {
        //   name: "Damn",
        //   singer: "Raftaar x kr$na",
        //   path:
        //     "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
        //   image:
        //     "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg"
        // },
        {
          name: "Feeling You",
          singer: "Raftaar x Harjas",
          path: "./assets/music/ViMeAnhBatChiaTay-MiuLeKarikChauDangKhoa-7479220.mp3",
          image:
            "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        }
      ],
      //${index === this.currentIndex ? 'active' : ''}
    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class="song" data-index=${index}>
                <div class="thumb"
                    style="background-image: url('${song.image}')">
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
        $('.playlist').innerHTML = htmls.join('')
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
            if (_this.isPlaying){
            audio.pause()
            }else{
            audio.play()
            }
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
                
            }
        }

        // Xử lý khi tua song
        progress.oninput = function(e){
            const seekTime =e.target.value * audio.duration / 100
            audio.currentTime = seekTime
        }

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
                    block:'center',
                })
            }, 300)
            
        }

        // Xử lý bật / tắt random song 
        randomBtn.onclick = function(){
            // console.log(_this.isRandom)
            _this.isRandom = !_this.isRandom
            // console.log(_this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
            
        }

        // Xử lý lặp lại một song
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
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
        // console.log(playlistSongs[this.currentIndex])
        
        // console.log(heading, cdThumb, audio)
        // console.log(this.songs.length) 
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
        // Định nghĩa các thuộc tính cho object, từ currentIndex lấy ra phần tử 
        // đầu tiên để xử lý
        this.defineProperties()

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()

        // Render playlists
        this.render()    
        
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        
    }
}

app.start()