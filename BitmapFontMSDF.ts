import "phaser";

export class BitmapTextMSDF extends Phaser.GameObjects.BitmapText
{
	constructor(scene: Phaser.Scene, x: number, y: number, font: string, text?: string | string[], size?: number, align?: number)
	{
		super(scene,x,y,font,text,size,align);
	}

	
};

export const MSDF_PIPELINE:string = 'MSDF';

// Create a MSDF bitmap text element
// you MUST add the pipeline with: this.renderer.pipelines.add(MSDF_PIPELINE, new MSDFPipeline(this.game)); in your scene create() function
export function addBitmapTextMSDF(scene: Phaser.Scene, textColor: Phaser.Display.Color, bgColor: Phaser.Display.Color, x: number, y: number, font: string, text?: string | string[], size?: number, align?: number):Phaser.GameObjects.BitmapText
{
	const multiColorPipeline = (scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.get(MSDF_PIPELINE);
	let element:Phaser.GameObjects.BitmapText = scene.add.bitmapText(x,y,font,text,size,align);
	element.setPipeline(multiColorPipeline, { color: [textColor.redGL, textColor.greenGL, textColor.blueGL, textColor.alphaGL], backgroundColor: [bgColor.redGL, bgColor.greenGL, bgColor.blueGL, bgColor.alphaGL] });
	return element;
}