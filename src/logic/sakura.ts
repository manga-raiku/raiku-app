/* eslint-disable camelcase */
function random(n: number): number {
  return Math.floor(Math.random() * n) + 1
}

interface Lorenzo {
  x: number
  y: number
  z: number
}
class Sakura {
  private gr = 5
  private phase = 0

  // eslint-disable-next-line no-useless-constructor
  constructor(
    private x_pos: number,
    private y_pos: number,
    private scale: number,
    private direction: Lorenzo,
    private rotate: Lorenzo,
    private wind: number
  ) {}

  draw(ctx: CanvasRenderingContext2D, maxWidth: number, maxHeight: number) {
    ctx.save()
    ctx.beginPath()
    ctx.translate(this.x_pos, this.y_pos)

    ctx.rotate((this.direction.y / 100) * Math.PI)
    ctx.scale(this.scale, this.scale)

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 10)
    grad.addColorStop(0, "#fbe0ef")
    grad.addColorStop(0.1, "#f8c1d5")
    grad.addColorStop(1, "#f3d3e2")
    ctx.fillStyle = grad

    const x_rad = Math.cos((this.direction.x * Math.PI) / 100)
    const z_rad = Math.cos((this.direction.z * Math.PI) / 100)
    ctx.moveTo(-6 * z_rad, -10 * x_rad)
    ctx.bezierCurveTo(
      -10 * z_rad,
      0 * x_rad,
      -5 * z_rad,
      10 * x_rad,
      0 * z_rad,
      10 * x_rad
    )
    ctx.bezierCurveTo(
      5 * z_rad,
      10 * x_rad,
      10 * z_rad,
      0 * x_rad,
      6 * z_rad,
      -10 * x_rad
    )
    ctx.bezierCurveTo(
      0 * z_rad,
      -10 * x_rad,
      0 * z_rad,
      -7 * x_rad,
      0 * z_rad,
      -5 * x_rad
    )
    ctx.bezierCurveTo(
      0 * z_rad,
      -7 * x_rad,
      0 * z_rad,
      -10 * x_rad,
      -6 * z_rad,
      -10 * x_rad
    )
    ctx.fill()
    ctx.restore()

    return this.moveSakura(maxWidth, maxHeight)
  }

  moveSakura(maxWidth: number, maxHeight: number) {
    if (this.phase === 0) {
      const ground = 1 + this.scale / 10
      if (this.y_pos > maxHeight * ground) {
        this.gr = 0
        this.wind = 0
        this.rotate.x = 0
        this.rotate.y = 0
        this.rotate.z = 0
        this.phase = 1
        // this.parent.fallenSakura++;
      }
    } else if (this.phase === 2) {
      if (this.gr > -3) this.gr += this.gr / 10
      // move_y = (this.gr * this.scale);
    }

    this.y_pos = this.y_pos + (this.gr * this.scale) / 2
    this.x_pos = this.x_pos + this.wind / 2
    this.direction.x += this.rotate.x / 2
    this.direction.y += this.rotate.y / 2
    this.direction.z += this.rotate.z / 2

    return this.x_pos > maxWidth || this.y_pos > maxHeight
  }
}

function createSakura(x1: number, y1: number, x2: number, y2: number): Sakura {
  const x_pos = Math.floor(Math.random() * (x2 - x1)) + x1 // map
  const y_pos = Math.floor(Math.random() * (y2 - y1)) + y1 // map
  // Note that the Sakura class is not defined in the provided code
  // so it will cause an error if you try to compile it
  // You will need to define the Sakura class or import it from another file
  // before you can use it here

  return new Sakura(
    x_pos,
    y_pos,
    Math.random() + 0.5,
    { x: random(360), y: random(360), z: random(360) },
    { x: random(10), y: random(10), z: random(10) },
    random(5)
  )
}

export function useSakura(element: HTMLCanvasElement) {
  const sakura = new Set<Sakura>()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ctx = element.getContext("2d")!

  let stopped = false
  const draw = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    if (Math.random() > 0.15 && sakura.size < 30) {
      sakura.add(createSakura(1, 1, ctx.canvas.width, 0))
    }

    // draw
    sakura.forEach((item) => {
      if (item.draw(ctx, ctx.canvas.width, ctx.canvas.height))
        sakura.delete(item)
    })

    if (!stopped) requestAnimationFrame(draw)
  }

  const stop = () => {
    stopped = true
  }

  return { draw, stop }
}
