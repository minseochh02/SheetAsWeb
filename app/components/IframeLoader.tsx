"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowDownCircle } from "lucide-react";

interface IframeLoaderProps {
	src: string;
	width?: number;
	height?: number;
}

export default function IframeLoader({
	src,
	width = 1405,
	height = 3000,
}: IframeLoaderProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const initialized = useRef(false);
	const [pullDistance, setPullDistance] = useState(0);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const touchStartY = useRef(0);

	// Handle iframe scaling
	useEffect(() => {
		if (initialized.current) return;
		initialized.current = true;

		const wrapper = wrapperRef.current;
		const iframe = iframeRef.current;
		if (!wrapper || !iframe) return;

		const calculateScale = () => {
			const wrapWidth = wrapper.clientWidth || width;
			const wrapHeight = wrapper.clientHeight || height;
			const childWidth = width;
			const childHeight = height;

			const wScale = wrapWidth / childWidth;
			const hScale = wrapHeight / childHeight;
			const scale = Math.min(wScale, hScale);

			iframe.style.transform = `scale(${scale})`;
			iframe.style.transformOrigin = "left top";
		};

		const resizeObserver = new ResizeObserver(calculateScale);
		resizeObserver.observe(wrapper);
		calculateScale();

		return () => {
			resizeObserver.disconnect();
		};
	}, [height, width]);

	// Handle touch events
	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartY.current = e.touches[0].clientY;
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (touchStartY.current === 0) return;

		const currentY = e.touches[0].clientY;
		const distance = Math.max(0, currentY - touchStartY.current);

		if (distance > 0) {
			e.preventDefault();
			setPullDistance(Math.min(distance, 150));
		}
	};

	const handleTouchEnd = () => {
		if (pullDistance > 100) {
			refresh();
		}
		touchStartY.current = 0;
		setPullDistance(0);
	};

	const refresh = () => {
		setIsRefreshing(true);
		if (iframeRef.current) {
			// ${src}${src.includes('?') ? '&' : '?'}t=${Date.now()}
			let src = iframeRef.current.src;
			iframeRef.current.src = `${src}${
				src.includes("?") ? "&" : "?"
			}t=${Date.now()}`;
		}
		setTimeout(() => {
			setIsRefreshing(false);
		}, 1000);
	};

	return (
		<div className="relative">
			{/* Pull to refresh overlay */}
			<div
				className="absolute inset-0 bg-transparent z-10"
				style={{ height: "100vh" }}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				{/* Pull to refresh indicator */}
				<div
					className="absolute left-0 right-0 flex justify-center items-center transition-transform"
					style={{
						transform: `translateY(${pullDistance - 60}px)`,
					}}
				>
					<ArrowDownCircle
						className={`transition-transform ${
							isRefreshing ? "animate-spin" : ""
						}`}
						style={{
							transform: `rotate(${Math.min(
								180,
								(pullDistance / 100) * 180
							)}deg)`,
						}}
						size={32}
					/>
				</div>
			</div>

			{/* Iframe container */}
			<div
				ref={wrapperRef}
				className="transition-transform"
				style={{
					transform: `translateY(${pullDistance}px)`,
				}}
			>
				<iframe
					ref={iframeRef}
					width={width}
					height={height}
					seamless
					frameBorder="0"
					scrolling="no"
					src={src}
					className="bg-white"
				/>
			</div>
		</div>
	);
}
