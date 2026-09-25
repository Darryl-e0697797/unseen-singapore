import Foundation
import AppKit
import ScreenCaptureKit
import AVFoundation
import CoreMedia
class Recorder: NSObject, SCStreamOutput {
 let writer: AVAssetWriter
 let input: AVAssetWriterInput
 var started = false
 init(_ path:String) throws {
 writer = try AVAssetWriter(outputURL:URL(fileURLWithPath:path),fileType:.mov)
 input = AVAssetWriterInput(mediaType:.video,outputSettings:[AVVideoCodecKey:AVVideoCodecType.h264,AVVideoWidthKey:2000,AVVideoHeightKey:768])
 input.expectsMediaDataInRealTime = true
 super.init(); writer.add(input); writer.startWriting()
 }
 func stream(_ stream:SCStream,didOutputSampleBuffer sampleBuffer:CMSampleBuffer,of type:SCStreamOutputType) {
 guard type == .screen, sampleBuffer.isValid else { return }
 if !started { writer.startSession(atSourceTime:sampleBuffer.presentationTimeStamp); started=true }
 if input.isReadyForMoreMediaData { input.append(sampleBuffer) }
 }
}
let app = NSApplication.shared
let content = try await SCShareableContent.excludingDesktopWindows(true,onScreenWindowsOnly:false)
guard let window = content.windows.first(where:{$0.owningApplication?.bundleIdentifier == "org.blenderfoundation.blender" && ($0.title ?? "").contains("dtss-assembly")}) else { fatalError("Blender window missing") }
print("Capturing Blender window",window.windowID)
let cfg=SCStreamConfiguration();cfg.width=2000;cfg.height=768;cfg.minimumFrameInterval=CMTime(value:1,timescale:30);cfg.showsCursor=false
let rec=try Recorder(CommandLine.arguments[1])
let stream=SCStream(filter:SCContentFilter(desktopIndependentWindow:window),configuration:cfg,delegate:nil)
try stream.addStreamOutput(rec,type:.screen,sampleHandlerQueue:DispatchQueue(label:"capture"))
try await stream.startCapture()
try await Task.sleep(for:.seconds(30))
try await stream.stopCapture();rec.input.markAsFinished();await rec.writer.finishWriting()
print("Done",rec.writer.status.rawValue)
