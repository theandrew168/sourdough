(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function o(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerpolicy&&(r.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?r.credentials="include":t.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(t){if(t.ep)return;t.ep=!0;const r=o(t);fetch(t.href,r)}})();class s{constructor(e,o,i){this.gl=e;const t=e.createShader(e.VERTEX_SHADER);this.#e(t,o);const r=e.createShader(e.FRAGMENT_SHADER);this.#e(r,i),this.program=e.createProgram(),this.#t(this.program,t,r),e.deleteShader(t),e.deleteShader(r)}bind(){this.gl.bindShader(this.program)}unbind(){this.gl.bindShader(0)}destroy(){this.gl.deleteProgram(this.program)}#e(e,o){if(this.gl.shaderSource(e,o),this.gl.compileShader(e),!this.gl.getShaderParameter(e,this.gl.COMPILE_STATUS))throw this.gl.getShaderInfoLog(e)}#t(e,o,i){if(this.gl.attachShader(e,o),this.gl.attachShader(e,i),this.gl.linkProgram(e),!this.gl.getProgramParameter(e,this.gl.LINK_STATUS))throw this.gl.getProgramInfoLog(e);this.gl.detachShader(e,o),this.gl.detachShader(e,i)}}const l=`
	attribute vec4 aVertexPosition;

	uniform mat4 uModelViewMatrix;
	uniform mat4 uProjectionMatrix;

	void main() {
		gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
	}
`,c=`
	void main() {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
`;async function h(){const e=document.querySelector("#glCanvas").getContext("webgl2");if(!e){alert("Unable to initialize WebGL. Your browser or machine may not support it.");return}const o=new s(e,l,c);console.log(o),e.clearColor(.2,.3,.4,1),e.clear(e.COLOR_BUFFER_BIT)}await h();
