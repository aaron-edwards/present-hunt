import AppKit
import CoreGraphics
import Foundation

let assetPaths = [
  "/Users/aaron/Development/present-hunt/public/media/unicorns/unicorn-wave.png",
  "/Users/aaron/Development/present-hunt/public/media/unicorns/unicorn-surf.png",
  "/Users/aaron/Development/present-hunt/public/media/unicorns/unicorn-bubbles-new.png",
  "/Users/aaron/Development/present-hunt/public/media/unicorns/unicorn-party-new.png",
  "/Users/aaron/Development/present-hunt/public/media/unicorns/unicorn-bake.png",
  "/Users/aaron/Development/present-hunt/public/media/unicorns/unicorn-wizard.png",
]

let threshold = 0.12

func rgbaDistance(_ a: [Double], _ b: [Double]) -> Double {
  let red = a[0] - b[0]
  let green = a[1] - b[1]
  let blue = a[2] - b[2]
  return (red * red + green * green + blue * blue).squareRoot()
}

func pixelColor(
  data: UnsafeMutablePointer<UInt8>,
  bytesPerRow: Int,
  x: Int,
  y: Int
) -> [Double] {
  let offset = y * bytesPerRow + x * 4
  return [
    Double(data[offset]) / 255.0,
    Double(data[offset + 1]) / 255.0,
    Double(data[offset + 2]) / 255.0,
    Double(data[offset + 3]) / 255.0,
  ]
}

func setAlpha(
  data: UnsafeMutablePointer<UInt8>,
  bytesPerRow: Int,
  x: Int,
  y: Int,
  alpha: UInt8
) {
  let offset = y * bytesPerRow + x * 4
  data[offset + 3] = alpha
}

func process(path: String) throws {
  guard
    let image = NSImage(contentsOfFile: path),
    let tiff = image.tiffRepresentation,
    let rep = NSBitmapImageRep(data: tiff),
    let cgImage = rep.cgImage,
    let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)
  else {
    throw NSError(domain: "remove_unicorn_backgrounds", code: 1)
  }

  let width = cgImage.width
  let height = cgImage.height
  let bytesPerRow = width * 4
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
    throw NSError(domain: "remove_unicorn_backgrounds", code: 2)
  }

  context.draw(cgImage, in: CGRect(x: 0, y: 0, width: width, height: height))
  guard let raw = context.data else {
    throw NSError(domain: "remove_unicorn_backgrounds", code: 3)
  }

  let data = raw.bindMemory(to: UInt8.self, capacity: width * height * 4)
  let background = [1.0, 1.0, 1.0, 1.0]
  var visited = Array(repeating: false, count: width * height)
  var queue: [(x: Int, y: Int)] = []

  func enqueue(_ x: Int, _ y: Int) {
    guard x >= 0, x < width, y >= 0, y < height else {
      return
    }

    let index = y * width + x
    if visited[index] {
      return
    }

    visited[index] = true
    let rgba = pixelColor(data: data, bytesPerRow: bytesPerRow, x: x, y: y)
    if rgba[3] > 0.0 && rgbaDistance(rgba, background) <= threshold {
      queue.append((x, y))
    }
  }

  for x in 0..<width {
    enqueue(x, 0)
    enqueue(x, height - 1)
  }

  for y in 0..<height {
    enqueue(0, y)
    enqueue(width - 1, y)
  }

  var cursor = 0
  while cursor < queue.count {
    let point = queue[cursor]
    cursor += 1

    setAlpha(data: data, bytesPerRow: bytesPerRow, x: point.x, y: point.y, alpha: 0)

    enqueue(point.x + 1, point.y)
    enqueue(point.x - 1, point.y)
    enqueue(point.x, point.y + 1)
    enqueue(point.x, point.y - 1)
  }

  guard let outputImage = context.makeImage() else {
    throw NSError(domain: "remove_unicorn_backgrounds", code: 4)
  }

  let outputRep = NSBitmapImageRep(cgImage: outputImage)
  guard let png = outputRep.representation(using: .png, properties: [:]) else {
    throw NSError(domain: "remove_unicorn_backgrounds", code: 5)
  }

  try png.write(to: URL(fileURLWithPath: path))
}

for path in assetPaths {
  do {
    try process(path: path)
    print("Updated \(path)")
  } catch {
    fputs("Failed \(path): \(error)\n", stderr)
    exit(1)
  }
}
