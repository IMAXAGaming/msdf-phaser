const fragShader = `
precision mediump float;
uniform sampler2D uMainSampler[%count%];

uniform float uDistanceFieldScale;
uniform vec4 uFgColor;
uniform vec4 uBgColor;

varying vec2 outTexCoord;
varying float outTexId;
varying vec4 outTint;
varying vec2 fragCoord;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

void main()
{
    vec4 texture;
    %forloop%
    float sd = median(texture.r, texture.g, texture.b);
    float screenPxDistance = uDistanceFieldScale*2.0*(sd - 0.5);
    float opacity = clamp(screenPxDistance + 0.5, 0.0, 1.0);
	gl_FragColor = mix(opacity*uBgColor, uFgColor, opacity);
	// gl_FragColor = mix(uBgColor, uFgColor, opacity); This is the correct for blending with a background color but it doesn't blend the alpha
}
`;

export default class MSDFPipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline {
	constructor(game) {
		super({
			game,
			fragShader,
			uniforms: [
				'uProjectionMatrix',
				'uMainSampler',
				'uDistanceFieldScale',
				'uFgColor',
				'uBgColor'
			]
		});

		this._distanceFieldScale = 1;
		this._fgColor = [1, 1, 1, 1];
		this._bgColor = [1, 1, 1, 0];
	}

	onPreRender() {
		this.set1f('uDistanceFieldScale', this._distanceFieldScale);
		this.set4f('uFgColor', this._fgColor[0], this._fgColor[1], this._fgColor[2], this._fgColor[3]);
		this.set4f('uBgColor', this._bgColor[0], this._bgColor[1], this._bgColor[2], this._bgColor[3]);
	}

	onBind(gameObject) {
		super.onBind();

		const data = gameObject.pipelineData;

		if (data.scale)
			this.scale = data.scale;

		if (data.color)
			this.color = data.color;

		if (data.backgroundColor)
			this.backgroundColor = data.backgroundColor;
	}

	get scale() {
		return this._distanceFieldScale;
	}

	set scale(value) {
		this._distanceFieldScale = value;
	}

	get color() {
		return this._fgColor;
	}

	set color(value) {
		this._fgColor = value;
	}

	get backgroundColor() {
		return this._bgColor;
	}

	set backgroundColor(value) {
		this._bgColor = value;
	}
}