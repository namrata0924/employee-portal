function loadScriptWithNoCache(src) {
//   console.log(`Loading script: ${src} with cache busting`);
  const script = document.createElement('script');
  script.src = src + '?v=' + new Date().getTime();

  script.onload = () => {
    // console.log(`Script loaded successfully: ${script.src}`);
  };

  script.onerror = () => {
    // console.error(`Failed to load script: ${script.src}`);
  };

  document.head.appendChild(script);
}

function loadCssWithNoCache(href) {
//   console.log(`Loading CSS: ${href} with cache busting`);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href + '?v=' + new Date().getTime();

  link.onload = () => {
    // console.log(`CSS loaded successfully: ${link.href}`);
  };

  link.onerror = () => {
    // console.error(`Failed to load CSS: ${link.href}`);
  };

  document.head.appendChild(link);
}


