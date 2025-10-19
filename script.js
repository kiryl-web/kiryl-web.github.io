document.addEventListener('DOMContentLoaded', function () {
    function updateProgressBar() {
        const windowHeight = window.innerHeight;
        const fullHeight = document.documentElement.offsetHeight;
        const scrollPosition =
            window.scrollY ||
            window.pageYOffset ||
            (document.body.scrollTop +
                (document.documentElement && document.documentElement.scrollTop || 0));
        const progress = (scrollPosition / (fullHeight - windowHeight)) * 100;
        document.getElementById('progress-bar-progress').style.width = progress + '%';
    }

    function scrollToPosition(position) {
        const scrollPercentage = position; // Adjust the value (10) to leave some room at the bottom
        const scrollPosition = (scrollPercentage / 100) * (document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });
    }

    window.addEventListener('scroll', updateProgressBar);

    document.getElementById('progress-bar').addEventListener('click', function (event) {
        const progressBar = document.getElementById('progress-bar');
        const progressBarWidth = progressBar.offsetWidth;
        const clickPosition = event.clientX - progressBar.getBoundingClientRect().left;
        const scrollPosition = (clickPosition / progressBarWidth) * 100;
        scrollToPosition(scrollPosition);
    });


    const iframes = document.querySelectorAll('.cta iframe');

    iframes.forEach(iframe => {
        window.addEventListener('message', function (event) {
            const height = event.data;
            if (typeof height === 'number') {
                iframe.style.height = height + 'px';
            }
        });
    });


}); 