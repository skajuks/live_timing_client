import React, { useRef, useEffect } from "react"

const UPDATE_RATE = 60


function RenderPositionGraph(ctx: CanvasRenderingContext2D) {
    const W = ctx.canvas.width
    const H = ctx.canvas.height

    ctx.clearRect(0, 0, W, H)

    ctx.strokeStyle = "#F00"
    ctx.lineWidth = 6
    ctx.strokeRect(0, 0, W, H)
}

export const PositionCanvas: React.FC = () => {
    const canvas_ref = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        let force_redraw = true
        let force_resize = true

        const canvas = canvas_ref.current as HTMLCanvasElement
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
        ctx.imageSmoothingEnabled = false

        let W: number
        let H: number

        const draw = () => {
            force_redraw = false

            requestAnimationFrame(() => {
                RenderPositionGraph(ctx)
            })
        }

        const resize = () => {
            const bound = canvas.getBoundingClientRect()
            if (!force_resize && (canvas.width == bound.width * window.devicePixelRatio) && (canvas.height == bound.height * window.devicePixelRatio))
                return

            force_resize = false

            canvas.width = bound.width * window.devicePixelRatio
            canvas.height = bound.height * window.devicePixelRatio
            W = canvas.width
            H = canvas.height

            // UpdateSize(ctx)
            ctx.clearRect(0, 0, W, H)

            force_redraw = true
            draw()
        }


        const rso = new ResizeObserver(resize)
        rso.observe(canvas_ref.current as HTMLElement)

        window.addEventListener("resize", resize)
        resize()

        const draw_interval = setInterval(draw, 1000 / UPDATE_RATE)

        return () => {
            rso.disconnect()
            window.removeEventListener("resize", resize)
            clearInterval(draw_interval)
        }
    }, [canvas_ref])

    return <canvas ref={canvas_ref}
        style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
        }}
    />
}


export const PositionCanvas_Test: React.FC = () => {
    return <div style={{ position: "relative", width: "800px", height: "200px", marginLeft: "auto", marginRight: "auto" }}><PositionCanvas /></div>
}

