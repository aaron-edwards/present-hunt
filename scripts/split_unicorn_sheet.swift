import AppKit
import CoreGraphics
import Foundation

struct OutputJob {
  let name: String
  let rect: CGRect
}

let sourcePath = "/Users/aaron/Development/present-hunt/public/media/unicorns/Unicorns-1.png"
let outputDirectory = "/Users/aaron/Development/present-hunt/public/media/unicorns"

let jobs: [OutputJob] = [
  OutputJob(name: "unicorn-bubbles-bubbles", rect: CGRect(x: 18, y: 208, width: 196, height: 250)),
  OutputJob(name: "unicorn-bubbles-gift", rect: CGRect(x: 210, y: 198, width: 202, height: 268)),
  OutputJob(name: "unicorn-bubbles-flowers", rect: CGRect(x: 408, y: 200, width: 206, height: 266)),
  OutputJob(name: "unicorn-bubbles-confetti", rect: CGRect(x: 612, y: 204, width: 198, height: 252)),
  OutputJob(name: "unicorn-bubbles-wave", rect: CGRect(x: 806, y: 188, width: 204, height: 272)),
  OutputJob(name: "unicorn-bubbles-rainbow", rect: CGRect(x: 1002, y: 186, width: 226, height: 286)),
  OutputJob(name: "unicorn-bubbles-stars", rect: CGRect(x: 1218, y: 178, width: 242, height: 302)),
]

let canvasSize = 512
let padding: CGFloat = 28
let alphaThreshold: UInt8 = 8

func nonTransparentBounds(image: CGImage) -> CGRect? {
  let width = image.width
  let height = image.height
  let bytesPerRow = width * 4
  let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
  let bitmapInfo = CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue)

  guard let context = CGContext(
    data: nil,
    width: width,
    height: height,
    bitsPerComponent: 8,
    bytesPerRow: bytesPerRow,
    space: colorSpace,
    bitmapInfo: bitmapInfo.rawValue
  ) else {
    return nil
  }

  context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
  guard let raw = context.data else {
    return nil
  }

  let data = raw.bindMemory(to: UInt8.self, capacity: width * height * 4)
  var minX = width
  var minY = height
  var maxX = 0
  var maxY = 0
  var found = false

  for y in 0..<height {
    for x in 0..<width {
      let offset = y * bytesPerRow + x * 4
      let alpha = data[offset + 3]
      if alpha > alphaThreshold {
        found = true
        minX = min(minX, x)
        minY = min(minY, y)
        maxX = max(maxX, x)
        maxY = max(maxY, y)
      }
    }
  }

  guard found else {
    return nil
  }

  return CGRect(x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1)
}

func renderToCanvas(image: CGImage, outputPath: String) throws {
  guard let bounds = nonTransparentBounds(image: image) else {
    throw NSError(domain: "split_unicorn_sheet", code: 1)
  }

  let output = NSImage(size: NSSize(width: canvasSize, height: canvasSize))
  output.lockFocus()
  NSGraphicsContext.current?.imageInterpolation = .high

  let side = max(bounds.width, bounds.height)
  let scale = (CGFloat(canvasSize) - (padding * 2.0)) / side
  let drawWidth = bounds.width * scale
  let drawHeight = bounds.height * scale
  let drawRect = CGRect(
    x: (CGFloat(canvasSize) - drawWidth) / 2.0,
    y: (CGFloat(canvasSize) - drawHeight) / 2.0,
    width: drawWidth,
    height: drawHeight
  )

  NSGraphicsContext.current?.cgContext.draw(
    image,
    in: drawRect,
    byTiling: false
  )

  output.unlockFocus()

  guard
    let tiff = output.tiffRepresentation,
    let rep = NSBitmapImageRep(data: tiff),
    let png = rep.representation(using: .png, properties: [:])
  else {
    throw NSError(domain: "split_unicorn_sheet", code: 2)
  }

  try png.write(to: URL(fileURLWithPath: outputPath))
}

guard
  let sourceImage = NSImage(contentsOfFile: sourcePath),
  let sourceTiff = sourceImage.tiffRepresentation,
  let sourceRep = NSBitmapImageRep(data: sourceTiff),
  let sourceCgImage = sourceRep.cgImage
else {
  fputs("Failed to load source sheet.\n", stderr)
  exit(1)
}

try FileManager.default.createDirectory(
  at: URL(fileURLWithPath: outputDirectory),
  withIntermediateDirectories: true
)

for job in jobs {
  guard let cropped = sourceCgImage.cropping(to: job.rect) else {
    fputs("Failed to crop \(job.name)\n", stderr)
    exit(1)
  }

  let outputPath = "\(outputDirectory)/\(job.name).png"
  do {
    try renderToCanvas(image: cropped, outputPath: outputPath)
    print("Wrote \(outputPath)")
  } catch {
    fputs("Failed to write \(job.name): \(error)\n", stderr)
    exit(1)
  }
}
