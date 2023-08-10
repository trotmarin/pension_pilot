//
AFRAME.registerComponent('step-ctrl', {
    schema: {
    },
    init() {
        console.log("Step-ctrl init");

        // document.addEventListener("DOMContentLoaded", function () 
        // {
        //     console.log("Step-ctrl DOMContentLoaded");
        
            // Variable ----------
            let stepIdx = -1
            let interval = null
            let animInterval = null
            let sequnceInterval = null;
            let isFirstTime = true;
            let isNeedRabbitIdle = false;
            let isNeedOutherAnim = false;
            let delightCount = -1;

            let isFirstSequence = false;

            const MAX_STEP_LEN = 8;

            const car = document.getElementById('car')
            const rabbit = document.getElementById('rabbit')

            //kisung
            const kisung = document.getElementById('kisung')
            // kisung.setAttribute( 'position' , { x : 1 , y : 1 , z : 0 });
            kisung.object3D.position.set(5,0,0);
            // Guide Panel ----------
            const guideDiv = document.getElementById('guidePanel')

            // TTS Script
            const captionList = [
                // '「갓생살기 with 펀드」란? 특정한 목표를 정하고, 이를 성취하기 위해 생산적이고 계획적인 생활을 실천한다는 의미의 MZ세대 유행어로, "펀드와 함께 재테크 목표달성을 위한 생활을 시작해보자"라는의미의 이벤트명 입니다.',
                // '펀드신규 이벤트 기간은 5월 2일부터 6월 30일까지!!',
                // '모든 상품이 대상은 아니고 참여운용사 상품을 가입했을때만 이벤트 대상이 된답니다!', 
                // '임의식펀드 5백만원이상 또는 적립식펀드 30만원 이상, 신규및 자동이체를 등록한 고객중 1,623명을 추첨하여 다양한 경품을 드립니다~ ',
                // '큰 금액을 가입한 고객에게는 더 큰 혜택을 드려요. 임의식펀드 5천만원이상 또는 적립식펀드 1백만원이상, 신규및 자동이체를 등록한 고객 중 510명을 추첨하여 경품을 드립니다~',  
                // '연금저축펀드 TDF상품을 가입한고객중 100명을 추첨하여 베스킨라빈스 패밀리아이스크림 쿠폰도 드려요!',  
                // '펀드 신규고객 총 2233명을 추첨하여 경품을 드리는 펀드신규이벤트입니다. 고객님께 이벤트를 안내하며 영업에 활용해 보세요! 기타 자세한 내용은 시행문을 참고해주세요.', 
                
                // 안녕하세요
                '「갓생살기 with 펀드」',
                '「갓생살기 with 펀드」\n펀드와 함께 재테크\n목표 달성을 시작해보자!',
                '5월 2일부터 6월 30일까지!',
                '참여운용사 상품을 가입했을\n때만 이벤트 대상!', 
                '임의식펀드 5백만원 이상\n적립식펀드 30만원 이상\n1,623명을 추첨!',
                ' 임의식펀드 5천만원 이상\n적립식펀드 1백만원 이상\n510명을 추첨!',  
                '연금저축펀드 TDF상품을\n가입한 고객 100명을 추첨!',  
                '펀드 신규고객 2233명을\n추첨하여 경품을 드리는\n펀드신규이벤트!', 
                '감사합니다'
            ]
            const subtitle = document.getElementById('subtitleBtn')
            subtitle.innerText = '「갓생살기 with 펀드」'
            
            const clickHand = document.getElementById('click-hand')

            const sceneEl = document.querySelector('a-scene');
            const exampleTarget = document.querySelector('#example-target');
            // const arSystem = sceneEl.systems["mindar-image-system"];

            // Audio - BGM & TTS ------
            let soundTTS = null // TTS
            let soundEffect = null // TTS

            // BGM
            const soundMain = new window.Howl({
                src: (`../../assets/audios/Cute_Avalanche_-_RKVC.mp3`),
                loop: true,
                autoplay: true,
                volume: 0.2,
            })
            soundMain.play()

            // Handle page visibility change:
            // - If the page is hidden, pause the video
            // - If the page is shown, play the video
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    soundMain.pause()
                    if (soundTTS !== null) soundTTS.pause()
                } else {
                    soundMain.play()
                }
            })

            // Animation Evnet ----------
        rabbit.addEventListener('animation-finished', () => {

            console.log('The Rabbit anim all loop is finished!')

            if (isNeedRabbitIdle) {
                isNeedRabbitIdle = false;
                console.log("isNeedRabbitIdle")
                rabbit.setAttribute('animation-mixer', { 
                    clip: 'Idle', 
                    loop: 'repeat', 
                    startAt: 0,
                    timeScale: 1,
                    repetitions: 'Infinity', 
                    crossFadeDuration: 0.4
                 })
            } else if (isNeedOutherAnim) {
                isNeedOutherAnim = false;
                isNeedRabbitIdle = true;
                console.log("isNeedOutherAnim")
                rabbit.setAttribute('animation-mixer', {
                    clip: 'Delight',
                    loop: 'repeat',
                    startAt: 0,
                    timeScale: 1,
                    repetitions: 'Infinity', 
                    crossFadeDuration: 0.4
                })
                delightCount = 0
            }
        })

        rabbit.addEventListener('animation-loop', (action) => { 
            if(delightCount > -1){
                ++delightCount;
                if(delightCount === 2){
                    delightCount = -1;
                    rabbit.setAttribute('animation-mixer', { 
                        clip: 'Idle', 
                        loop: 'repeat', 
                        startAt: 0,
                        timeScale: 1,
                        repetitions: 'Infinity', 
                        crossFadeDuration: 0.4
                     })
                }
            }
        })

            // car.addEventListener('animation-finished', () => {
            //     console.log('The car animation is finished!')
            // })


            // 01: Idle      (Frame Start:  0,         Frame End :  48 )
            // 02: Delight   (Frame Start: 60,         Frame End : 105 )
            // 03: Walk      (Frame Start: 115,        Frame End : 138 )
            // 04: Joy       (Frame Start: 149,        Frame End : 256 )
            // 05: Pride     (Frame Start: 270,        Frame End : 346 )
            // 06: Confetti  (Frame Start: 379,        Frame End : 447 )
            // 07: Wave goodbye (Frame Start: 480,     Frame End : 573 )
            // 08: Surprise   (Frame Start: 600,     Frame End : 619 )
            // 09: Gift_01 (Frame Start: 640 ,     Frame End :880 )
            // 10: Gift_02 (Frame Start: 940 ,     Frame End :1180  )
            // 11: Gift_03 (Frame Start: 1252,     Frame End :1490 )

            //Open_Door Close_Door Wheel_Rotate

            /// //////////////////////////////////////////////////////////
            /// -------------------- stepHandler -------------------- ///
            /// //////////////////////////////////////////////////////////
            const userClickHandler = () => {
                if (isFirstSequence) return;
                
                if (interval !== null) clearInterval(interval)
                ++stepIdx

                // ---------- Caption ----------
                subtitle.innerText = captionList[stepIdx]
                // ---------- Sound ----------
                if (soundTTS !== null) {
                    soundTTS.stop()  // 플레이중인 음원이 있으면 스탑
                    soundTTS = null;
                }
                if (stepIdx > 0 && stepIdx < 9) {
                    soundTTS = new window.Howl({
                        src: (`./assets/audios/tts_0${stepIdx -1}.mp3`),
                    })
                    soundTTS.play()
                } 
               
                // ---------- Animation ---------- walk spin point stand bow wave idle break
                if (animInterval != null) {
                    clearInterval(animInterval)
                }

                clickHand.style.display = 'none'
                if (sequnceInterval != null) {
                    clearInterval(sequnceInterval)
                }
                
                // const animationMixer = rabbit.getAttribute('animation-mixer')
                // if (animationMixer) {
                //     animationMixer.clampWhenFinished = true
                //     animationMixer.crossFadeDuration = 0.2
                //     animationMixer.startAt = 0
                // }
              
                isNeedRabbitIdle = false;
                isNeedOutherAnim = false;

                if (stepIdx === 0) { // 안녕하세요
                    rabbit.removeAttribute('animation-mixer');
                    if(isFirstTime){
                        isFirstTime = false; 

                        isFirstSequence = true;
                        rabbit.setAttribute('animation-mixer', { 
                            clip: 'Idle',
                            loop: 'repeat', 
                            repetitions: 'Infinity', 
                            timeScale: 1,
                            clampWhenFinished : true,
                            crossFadeDuration: 0.4
                        })
                      
                      
                      
                        car.setAttribute('animation__position', {property: 'position', to: {x: -4, y: 0, z: 0}, dur: 4000, easing: 'easeInOutCubic', loop: false})
                        // car.setAttribute('animation__scale', {property: 'scale', to: {x: 0.8, y: 0.8, z: 0.8}, dur: 8000, easing: 'easeInOutCubic', loop: false})
                        car.setAttribute('animation-mixer', { clip: 'Wheel_Rotate', loop: 'once' })
                        
                        animInterval = setTimeout(() => {
                            car.setAttribute('animation-mixer', { clip: 'Open_Door', loop: 'once', clampWhenFinished : true});
                          
                            rabbit.setAttribute('animation-mixer', {
                                clip: 'Walk',
                                loop: 'repeat',
                                startAt: 0,
                                timeScale: 1,
                                crossFadeDuration: 0.4
                            })
                            rabbit.setAttribute('animation__rotation', {property: 'rotation', to: {x: 0, y: 90, z: 0}, dur: 2000, easing: 'linear', loop: false})
                           
                            
                            setTimeout(() => {
                                rabbit.setAttribute('animation__position', {property: 'position', to: {x: 2.7, y: 1, z: 0}, dur: 3000, easing: 'linear', loop: false})
                            }, 500)

                            // setTimeout(() => {
                            //     rabbit.setAttribute('animation__position', {property: 'position', to: {x: 3, y: 2, z: 0}, dur: 500, easing: 'easeInCubic', loop: false})
                            // }, 2500)

                            setTimeout(() => {
                                rabbit.setAttribute('animation__position', {property: 'position', to: {x: 4, y: 0, z: 0}, dur: 1000, easing: 'easeInExpo', loop: false})
                                // rabbit.setAttribute('animation__scale', {property: 'scale', to: {x: 1.7, y: 1.7, z: 1.7}, dur: 1000, easing: 'easeInCubic', loop: false})
                            }, 3500)


                            setTimeout(() => {
                                car.setAttribute('animation__position', {property: 'position', to: {x: -12, y: 0, z: 0}, dur: 4000, easing: 'easeInOutCubic', loop: false})
                                
                                rabbit.setAttribute('animation-mixer', {
                                    clip: 'Idle',
                                    loop: 'repeat',
                                    startAt: 0,
                                    timeScale: 1,
                                    crossFadeDuration: 0.4
                                })

                                rabbit.setAttribute('animation__position', {property: 'position', to: {x: 12, y: 0, z: 0}, dur: 4000, easing: 'easeInOutCubic', loop: false})

                                rabbit.setAttribute('animation__rotation', {property: 'rotation', to: {x: 0, y: 0, z: 0}, dur: 1000, easing: 'easeInOutCubic', loop: false})
                            }, 5000)

                            setTimeout(() => {

                                 rabbit.setAttribute('animation__scale', {property: 'scale', to: {x: 1.7, y: 1.7, z: 1.7}, dur: 1000, easing: 'easeInCubic', loop: false})
                                
                                 rabbit.setAttribute('animation-mixer', {clip: 'Wave_goodbye', loop: 'repeat', startAt: 0,timeScale: 1,crossFadeDuration: 0.4})
                                delightCount = 1

                                isFirstSequence = false;
                            }, 6000)

                        }, 4000)

                    } else {

                        rabbit.setAttribute('animation-mixer', {clip: 'Wave_goodbye', loop: 'repeat', startAt: 0,timeScale: 1,crossFadeDuration: 0.4})
                        delightCount = 1
                    }
                } else if (stepIdx === 1) { // 「갓생살기 with 펀드」란?
                    rabbit.setAttribute('animation-mixer', {clip: 'Joy', loop: 'repeat', repetitions: 3, crossFadeDuration: 0.4 })
                    isNeedRabbitIdle = true;
                } else if (stepIdx === 2) { // 펀드신규 이벤트
                    rabbit.setAttribute('animation-mixer', { clip: 'Pride', loop: 'repeat', repetitions : 2, crossFadeDuration: 0.4})
                    isNeedRabbitIdle = true;

                } else if (stepIdx === 3) { // 모든 상품이 대상은 아니고
                    rabbit.setAttribute('animation-mixer', { clip: 'Surprise', loop: 'once', timeScale: 0.25, crossFadeDuration: 0.4 })
                    isNeedRabbitIdle = true;

                } else if (stepIdx === 4) {
                    rabbit.setAttribute('animation-mixer', { clip: 'Gift_01', loop: 'once', crossFadeDuration: 0.4 })
                    isNeedRabbitIdle = true;

                } else if (stepIdx === 5) {
                    rabbit.setAttribute('animation-mixer', { clip: 'Gift_02', loop: 'once', crossFadeDuration: 0.4 })
                    isNeedOutherAnim = true;

                } else if (stepIdx === 6) {
                    rabbit.setAttribute('animation-mixer', { clip: 'Gift_03', loop: 'once', crossFadeDuration: 0.4 })
                    isNeedRabbitIdle = true;

                } else if (stepIdx === 7) { // 펀드 신규고객 총 2233명
                    rabbit.setAttribute('animation-mixer', { clip: 'Confetti', loop: 'repeat', repetitions : 4, crossFadeDuration: 0.4})
                    isNeedOutherAnim = true;
                   
                    if (soundEffect !== null) {
                        soundEffect.stop()  // 플레이중인 음원이 있으면 스탑
                        soundEffect = null;
                        soundEffect = new window.Howl({
                            src: (`../../assets/audios/.mp3`),
                        })
                        soundEffect.play()
                    }
                } else if (stepIdx === 8) { // 감사합니다
                    rabbit.setAttribute('animation-mixer', { clip: 'Wave_goodbye', loop: 'repeat', startAt: 0, timeScale: 1, repetitions: 'Infinity' })
                    delightCount = 1
                }

                sequnceInterval = setTimeout(() => {
                    clickHand.style.display = 'block'
                }, 10000)

                if (stepIdx === MAX_STEP_LEN) {
                  stepIdx = -1
                }
            }

            // xrScene.sceneEl.addEventListener('xrimagefound', () => {
            //     // 최초 한 번만 실행, Run only once at first
            //     if (!isFirstFounded) {
            //         isFirstFounded = true
            //         console.log('[app.js] Xr Image was founded first time!')

            //         guideDiv.style.display = 'none'
            //         userClickHandler()

            //         // 모델이 나타난 다음 FadeIn 효과와 함께 이미지, 체험중 텍스트가 나타남.
            //         setTimeout(() => {
            //             subtitle.setAttribute('animation', { property: 'opacity', to: 1, dur: 2000, easing: 'linear', loop: 0 })
            //             //   prewriteImg.setAttribute('animation', {property: 'opacity', to: 1, dur: 2000, easing: 'linear', loop: 0})
            //             //   setTimeout(() => {
            //             //     tooltipBox.setAttribute('visible', true)
            //             //     clickCursor.setAttribute('visible', true)
            //             //   }, 2000)
            //         }, 2000)
            //     }
            // })

            // ---------- Reset ----------
            subtitle.onclick = userClickHandler

        // arReady event triggered when ready
        sceneEl.addEventListener("arReady", (event) => {
            console.log("MindAR is ready")
            // interval = setTimeout(() => {
            //     userClickHandler()
            // }, 3000)
        });
        // // arError event triggered when something went wrong. Mostly browser compatbility issue
        // sceneEl.addEventListener("arError", (event) => {
        //     // console.log("MindAR failed to start")
        // });
        // // detect target found
        exampleTarget.addEventListener("targetFound", event => {
            console.log("target found");
            guideDiv.style.display = 'none';
            if (isFirstTime) {
                interval = setTimeout(() => {
                    userClickHandler()
                }, 2000)
            }
        });
// // detect target lost
// exampleTarget.addEventListener("targetLost", event => {
//     console.log("target lost");
// });

            // tooltipBox.addEventListener('click', () => {
            //     // console.log('[app.js] tooltipBox Click  : ')
            //     // if (!isBlocking)
            //     {
            //         // isBlocking = true
            //         if (stepIdx === 7) {
            //             // window.open('https://shot.kbstar.com/q.jsp#heq5j1k2');
            //             if (soundTTS !== null) soundTTS.stop()
            //             window.open('https://ombr2.kbstar.com/quics?page=C106533&brncd=3876&bzwkDstic=3&noct=1013&QViewPC=N')
            //         } else {
            //             userClickHandler()
            //         }
            //         // setTimeout(() => {
            //         //   isBlocking = false
            //         // }, 1000)
            //     }
            // })

            // replayBox.addEventListener('click', () => {
            //     // console.log('[app.js] replaybox Click  : ', replayBox.getAttribute('visible'))
            //     if (stepIdx === 7 && replayBox.getAttribute('visible')) {
            //         stepIdx = 0
            //         replayBox.classList.remove('cantap')
            //         replayBox.setAttribute('visible', false)
            //         userClickHandler()
            //     }
            // })
        // })
    },
})


// Back Up
// {
//     // tooltip & clickCursor ----------
//     const replayBox = document.getElementById('replayBox')
//     const tooltipBox = document.getElementById('tooltipBox')
//     const clickCursor = document.getElementById('clickCursor')
//     replayBox.setAttribute('visible', false)
//     tooltipBox.setAttribute('visible', false)
//     clickCursor.setAttribute('visible', false)

//     const corsorY = -0.055
//     const isBlocking = false


//     // 미리작성 이미지
//     // const prewriteImg = document.getElementById('prewriteImg')

//     // ---------- Image ----------
//     prewriteImg.removeAttribute('src')
//     if (stepIdx === 0) {
//         prewriteImg.setAttribute('src', `#Prewrite_0${stepIdx}`)
//         this.data.currPosIdx = stepIdx
//     } else {
//         prewriteImg.setAttribute('src', `#Prewrite_0${stepIdx - 1}`)

//         if (stepIdx === 5) {

//         } else if (stepIdx <= 7) {
//             this.data.currPosIdx = stepIdx
//         } else {
//             this.data.currPosIdx = stepIdx
//         }
//     }

//     const setTooltipContainer = (w, h, tooltipPos, cursorPos) => {
//         tooltipBox.setAttribute('slice9', { color: 'red', width: w, height: h, left: 20, right: 43, top: 20, bottom: 43, src: '#tooltipImg' })
//         tooltipBox.setAttribute('position', tooltipPos)  // "-0.105 0.018 0.002"
//         clickCursor.setAttribute('position', cursorPos)
//     }

//     // ---------- Caption ----------
//     if (stepIdx === 0) {
//         tooltipBox.setAttribute('visible', false)
//         clickCursor.setAttribute('visible', false)
//         // subtitle.innerText = '미리작성 서비스 입금편 함께 알아볼까요?'
//         // 0.25 -0.055
//     } else if (stepIdx === 1) {
//         // subtitle.innerText = '먼저 입금 버튼을 눌러주세요!'
//         // tooltipBox.setAttribute('visible', true)
//         // clickCursor.setAttribute('visible', true)
//         setTooltipContainer(0.35, 0.4, { x: -0.105, y: 0.018, z: 0.002 }, { x: -0.105 + 0.04 + 0.05, y: 0.018 + corsorY, z: 0.004 })
//     } else if (stepIdx === 2) {
//         tooltipBox.setAttribute('visible', true)
//         clickCursor.setAttribute('visible', true)
//         // subtitle.innerText = '원하시는 입금 방법을 선택할 수 있습니다.\n여기서는 한 건 입금을 함께 해보겠습니다!'
//         setTooltipContainer(0.62, 0.15, { x: -0.06, y: 0.008, z: 0.002 }, { x: -0.06 + 0.095 + 0.05, y: 0.008 + corsorY, z: 0.004 })
//     } else if (stepIdx === 3) {
//         // subtitle.innerText = '입금 은행을 선택해보겠습니다. 입금 은행 칸을 눌러주세요!'
//         setTooltipContainer(0.95, 0.24, { x: 0, y: 0.03, z: 0.002 }, { x: 0.1, y: 0.03 + corsorY, z: 0.004 })
//     } else if (stepIdx === 4) {
//         // subtitle.innerText = '받는 분 계좌의 은행을 선택해주세요!'
//         setTooltipContainer(0.3, 0.27, { x: -0.16, y: 0.064, z: 0.002 }, { x: -0.16 + 0.064 + 0.02, y: 0.06 + corsorY, z: 0.003 })
//     } else if (stepIdx === 5) {
//         // subtitle.innerText = '받는 분 계좌번호와 금액을 입력해주세요!'
//         setTooltipContainer(0.95, 0.38, { x: 0, y: -0.36, z: 0.002 }, { x: 0.2, y: -0.36 + corsorY, z: 0.003 })
//     } else if (stepIdx === 6) {
//         // subtitle.innerText = '받는 분 통장 표시와 자필성명을 입력하신 후 작성완료 버튼을 눌러주세요!'
//         setTooltipContainer(1.05, 0.19, { x: 0, y: -0.395, z: 0.002 }, { x: 0.2, y: -0.395 + corsorY, z: 0.003 })
//     } else if (stepIdx === 7) {
//         // subtitle.innerText = '입금 신청서 미리작성이 완료되었습니다!'
//         replayBox.setAttribute('visible', true)
//         replayBox.classList.add('cantap')
//         setTooltipContainer(0.95, 0.28, { x: 0, y: -0.255, z: 0.002 }, { x: 0.05, y: -0.31, z: 0.003 })
//     } else if (stepIdx >= 8) {
//         // subtitle.innerText = '입금 신청서 미리작성이 완료되었습니다!'
//         // setTooltipContainer(0.93, 0.35, {x: 0, y: -0.295, z: 0.002}, {x: 0.25, y: -0.35, z: 0.003})
//         stepIdx = 0
//     }


//     //   tick(){
//     //     if (this.data.isLerping) {
//     //       rabbit.object3D.position.lerp(this.data.positions[this.data.currPosIdx], 0.05)
//     //     };
//     //   };
// }