//
AFRAME.registerComponent('step-ctrl', {
    schema: {
    },
    init() {
        console.log("Step-ctrl init");

        // Variable ----------
        let stepIdx = -1
        let interval = null
        let animInterval = null
        let sequnceInterval = null;
        let isFirstTime = true;

        const MAX_STEP_LEN = 8;

        //kisung
        const taewon = document.getElementById('taewon')
        // Guide Panel ----------
        const guideDiv = document.getElementById('guidePanel')

        // TTS Script
        const captionList = [
            //  '사전지정운용제도란? DC 및 IRP 가입자가 퇴직연금 적립금을 운용할 상품을 결정하지 않을 경우 사전에 정해둔 운용상품으로 적립금이 자동 운용되도록 하는 제도입니다.',

            '안녕하세요',
            '사전지정운용제도란?',
            '설명이 이해되셨을까요?',
            '감사합니다',          
        ]
        
        const subtitle = document.getElementById('subtitleBtn')
        subtitle.innerText = '안녕하세요'
        subtitle.style.display = 'none';

        const clickHand = document.getElementById('click-hand')
        clickHand.style.display = 'none'

        const tooltip = document.getElementById('tooltip')

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

        // idle, walk, wave, break, bow

        /// //////////////////////////////////////////////////////////
        /// -------------------- stepHandler -------------------- ///
        /// //////////////////////////////////////////////////////////
        const userClickHandler = () => {

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
                    src: (`./assets/audios/ttsN_0${stepIdx}.mp3`),
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
      

            if (stepIdx === 0) { // 안녕하세요
                // rabbit.removeAttribute('animation-mixer');

                if(isFirstTime){
                    isFirstTime = false; 
                }
                
                taewon.setAttribute('animation__scale', {property: 'scale', to: {x: 0.2, y: 0.2, z: 0.2}, dur: 1000, easing: 'easeInCubic', loop: false})
                                
                taewon.setAttribute('animation__position', { property: 'position', to: { x: -0.35, y: -0.3, z: 0 }, dur: 4000, easing: 'easeInOutCubic', loop: false })

                taewon.setAttribute('animation-mixer', {
                    clip: 'walk',
                    loop: 'repeat',
                    startAt: 0,
                    timeScale: 1,
                    crossFadeDuration: 0.4
                })

                animInterval = setTimeout(() => {
                    soundTTS = new window.Howl({
                        src: (`./assets/audios/ttsN_0${stepIdx}.mp3`),
                    })
                    soundTTS.play()

                    taewon.setAttribute('animation-mixer', {
                        clip: 'wave',
                        loop: 'once',
                        startAt: 0,
                        timeScale: 1,
                        crossFadeDuration: 0.4
                    })              
                }, 4000)                            
            } else if (stepIdx === 1) { // 사전운용지정제도란?
               
                taewon.setAttribute('animation-mixer', {
                    clip: 'idle',
                    loop: 'repeat',
                    startAt: 0,
                    timeScale: 1,
                    crossFadeDuration: 0.4
                })

                // tooltip.setAttribute('opacity', 1);
                tooltip.setAttribute('animation__scale', {property: 'scale', to: {x: 1, y: 1, z: 1}, dur: 1000, easing: 'easeInCubic', loop: false})

                // rabbit.setAttribute('animation-mixer', {clip: 'Joy', loop: 'repeat', repetitions: 3, crossFadeDuration: 0.4 })
                // isNeedRabbitIdle = true;
            } else if (stepIdx === 2) { // 설명이 이해되셨나요? 
                subtitle.style.display = 'block'
                
                sequnceInterval = setTimeout(() => {
                    clickHand.style.display = 'block'
                }, 5000)
            
            } else if (stepIdx === 3) { // 감사합니다. 
                taewon.setAttribute('animation-mixer', {
                    clip: 'bow',
                    loop: 'once',
                    startAt: 0,
                    timeScale: 1,
                    crossFadeDuration: 0.4
                })

                animInterval = setTimeout(() => {
                    taewon.setAttribute('animation-mixer', {
                        clip: 'break',
                        loop: 'repeat',
                        startAt: 0,
                        timeScale: 1,
                        crossFadeDuration: 0.4
                    })
                }, 3000)
            
                sequnceInterval = setTimeout(() => {
                    clickHand.style.display = 'block'
                }, 5000)
            }
            // sequnceInterval = setTimeout(() => {
            //     clickHand.style.display = 'block'
            // }, 10000)


            if (stepIdx === 0) {
                setTimeout(() => {
                    userClickHandler();
                  }, 8000)
            } else if (stepIdx === 1) {
                setTimeout(() => {
                    userClickHandler();
                  }, 15000)
            }          
            else if (stepIdx === 3) {
                stepIdx = 0
            }
        }
   
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
    },
})

