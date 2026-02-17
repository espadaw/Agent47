"use client";

import { useEffect, useRef } from "react";

// Simplified continent data as latitude/longitude paths
const continents = [
    // North America (simplified)
    [
        { lat: 70, lon: -170 }, { lat: 72, lon: -160 }, { lat: 70, lon: -140 },
        { lat: 60, lon: -130 }, { lat: 50, lon: -125 }, { lat: 45, lon: -120 },
        { lat: 35, lon: -115 }, { lat: 30, lon: -110 }, { lat: 25, lon: -105 },
        { lat: 20, lon: -100 }, { lat: 18, lon: -95 }, { lat: 15, lon: -90 },
        { lat: 10, lon: -85 }, { lat: 10, lon: -80 }, { lat: 12, lon: -75 },
        { lat: 15, lon: -70 }, { lat: 25, lon: -80 }, { lat: 30, lon: -85 },
        { lat: 35, lon: -75 }, { lat: 40, lon: -70 }, { lat: 45, lon: -65 },
        { lat: 50, lon: -60 }, { lat: 55, lon: -65 }, { lat: 60, lon: -70 },
        { lat: 65, lon: -80 }, { lat: 68, lon: -90 }, { lat: 70, lon: -100 }
    ],
    // Europe/Africa (simplified)
    [
        { lat: 70, lon: -10 }, { lat: 65, lon: 0 }, { lat: 60, lon: 10 },
        { lat: 55, lon: 15 }, { lat: 50, lon: 20 }, { lat: 45, lon: 25 },
        { lat: 35, lon: 30 }, { lat: 30, lon: 32 }, { lat: 20, lon: 35 },
        { lat: 10, lon: 38 }, { lat: 0, lon: 40 }, { lat: -10, lon: 42 },
        { lat: -20, lon: 40 }, { lat: -30, lon: 35 }, { lat: -35, lon: 25 },
        { lat: -33, lon: 20 }, { lat: -20, lon: 15 }, { lat: -10, lon: 10 },
        { lat: 0, lon: 8 }, { lat: 10, lon: 5 }, { lat: 15, lon: 0 },
        { lat: 25, lon: -5 }, { lat: 35, lon: -10 }, { lat: 40, lon: -8 },
        { lat: 50, lon: -5 }, { lat: 60, lon: -5 }
    ],
    // Asia (simplified)
    [
        { lat: 75, lon: 60 }, { lat: 70, lon: 80 }, { lat: 65, lon: 90 },
        { lat: 55, lon: 100 }, { lat: 50, lon: 120 }, { lat: 45, lon: 130 },
        { lat: 40, lon: 140 }, { lat: 35, lon: 138 }, { lat: 30, lon: 120 },
        { lat: 20, lon: 110 }, { lat: 10, lon: 105 }, { lat: 0, lon: 110 },
        { lat: -10, lon: 120 }, { lat: -8, lon: 140 }, { lat: 10, lon: 125 },
        { lat: 20, lon: 105 }, { lat: 25, lon: 95 }, { lat: 30, lon: 85 },
        { lat: 35, lon: 75 }, { lat: 45, lon: 70 }, { lat: 55, lon: 60 },
        { lat: 65, lon: 55 }
    ],
    // Australia (simplified)
    [
        { lat: -10, lon: 115 }, { lat: -15, lon: 125 }, { lat: -20, lon: 135 },
        { lat: -25, lon: 145 }, { lat: -30, lon: 150 }, { lat: -35, lon: 148 },
        { lat: -38, lon: 145 }, { lat: -37, lon: 140 }, { lat: -35, lon: 135 },
        { lat: -30, lon: 125 }, { lat: -25, lon: 115 }, { lat: -18, lon: 120 }
    ],
    // South America (simplified)
    [
        { lat: 10, lon: -75 }, { lat: 5, lon: -70 }, { lat: 0, lon: -75 },
        { lat: -5, lon: -80 }, { lat: -10, lon: -75 }, { lat: -15, lon: -70 },
        { lat: -20, lon: -68 }, { lat: -25, lon: -70 }, { lat: -30, lon: -70 },
        { lat: -35, lon: -65 }, { lat: -40, lon: -70 }, { lat: -45, lon: -72 },
        { lat: -50, lon: -70 }, { lat: -53, lon: -68 }, { lat: -45, lon: -65 },
        { lat: -35, lon: -60 }, { lat: -25, lon: -55 }, { lat: -15, lon: -50 },
        { lat: -5, lon: -48 }, { lat: 0, lon: -50 }, { lat: 5, lon: -55 }
    ]
];

export function Globe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const size = 800;
        canvas.width = size;
        canvas.height = size;
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size * 0.38;

        let rotation = 0;

        const project3D = (lat: number, lon: number, rotation: number) => {
            const latRad = (lat * Math.PI) / 180;
            const lonRad = ((lon + rotation) * Math.PI) / 180;

            const x = radius * Math.cos(latRad) * Math.sin(lonRad);
            const y = radius * Math.sin(latRad);
            const z = radius * Math.cos(latRad) * Math.cos(lonRad);

            return { x: centerX + x, y: centerY - y, z };
        };

        const drawGlobe = () => {
            ctx.clearRect(0, 0, size, size);
            rotation += 0.2;

            // Draw latitude lines (parallels)
            ctx.strokeStyle = "rgba(220, 38, 38, 0.4)";
            ctx.lineWidth = 1;
            for (let lat = -80; lat <= 80; lat += 20) {
                ctx.beginPath();
                let started = false;
                for (let lon = -180; lon <= 180; lon += 5) {
                    const point = project3D(lat, lon, rotation);
                    if (point.z > 0) {
                        if (!started) {
                            ctx.moveTo(point.x, point.y);
                            started = true;
                        } else {
                            ctx.lineTo(point.x, point.y);
                        }
                    }
                }
                ctx.stroke();
            }

            // Draw longitude lines (meridians)
            ctx.strokeStyle = "rgba(220, 38, 38, 0.5)";
            ctx.lineWidth = 1.2;
            for (let lon = -180; lon < 180; lon += 20) {
                ctx.beginPath();
                let started = false;
                for (let lat = -90; lat <= 90; lat += 5) {
                    const point = project3D(lat, lon, rotation);
                    if (point.z > 0) {
                        if (!started) {
                            ctx.moveTo(point.x, point.y);
                            started = true;
                        } else {
                            ctx.lineTo(point.x, point.y);
                        }
                    }
                }
                ctx.stroke();
            }

            // Draw continents
            ctx.fillStyle = "rgba(220, 38, 38, 0.15)";
            ctx.strokeStyle = "rgba(220, 38, 38, 0.7)";
            ctx.lineWidth = 1.5;

            continents.forEach(continent => {
                ctx.beginPath();
                let started = false;
                continent.forEach(point => {
                    const projected = project3D(point.lat, point.lon, rotation);
                    if (projected.z > 0) {
                        if (!started) {
                            ctx.moveTo(projected.x, projected.y);
                            started = true;
                        } else {
                            ctx.lineTo(projected.x, projected.y);
                        }
                    }
                });
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            });

            // Draw equator glow
            ctx.strokeStyle = "rgba(220, 38, 38, 0.8)";
            ctx.lineWidth = 2;
            ctx.shadowColor = "rgba(220, 38, 38, 0.5)";
            ctx.shadowBlur = 10;
            ctx.beginPath();
            let started = false;
            for (let lon = -180; lon <= 180; lon += 2) {
                const point = project3D(0, lon, rotation);
                if (point.z > 0) {
                    if (!started) {
                        ctx.moveTo(point.x, point.y);
                        started = true;
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                }
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            requestAnimationFrame(drawGlobe);
        };

        drawGlobe();

    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full max-w-[800px] max-h-[800px] mx-auto"
            style={{ opacity: 0.7 }}
        />
    );
}
