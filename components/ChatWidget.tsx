"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
	role: "user" | "assistant";
	content: string;
}

const GREETING =
	"Hi! Tell me about your business and I'll help you find the perfect template.";

export default function ChatWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([
		{ role: "assistant", content: GREETING },
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isLoading]);

	useEffect(() => {
		if (isOpen) {
			inputRef.current?.focus();
		}
	}, [isOpen]);

	const sendMessage = async () => {
		const trimmed = input.trim();
		if (!trimmed || isLoading) return;

		const userMessage: Message = { role: "user", content: trimmed };
		const updatedMessages = [...messages, userMessage];
		setMessages(updatedMessages);
		setInput("");
		setIsLoading(true);

		try {
			const res = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: trimmed,
					history: updatedMessages.map((m) => ({
						role: m.role,
						content: m.content,
					})),
				}),
			});

			const data = await res.json();
			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: data.reply },
			]);
		} catch {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content:
						"Sorry, something went wrong. You can browse templates directly at /generate.",
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	return (
		<>
			{/* Chat panel */}
			<div
				className={`fixed bottom-20 right-4 z-[9999] w-[350px] max-sm:w-[calc(100vw-2rem)] max-sm:right-0 max-sm:left-0 max-sm:mx-auto max-sm:bottom-0 max-sm:rounded-none flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 origin-bottom-right ${
					isOpen
						? "scale-100 opacity-100 pointer-events-auto"
						: "scale-95 opacity-0 pointer-events-none"
				}`}
				style={{ height: isOpen ? "500px" : "0px" }}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-4 py-3 bg-brand-600 text-white shrink-0">
					<span className="font-semibold text-sm">
						CraftMyPage Assistant
					</span>
					<button
						onClick={() => setIsOpen(false)}
						className="p-1 hover:bg-brand-700 rounded-lg transition-colors"
						aria-label="Close chat"
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-4 space-y-3">
					{messages.map((msg, i) => (
						<div
							key={i}
							className={`flex ${
								msg.role === "user"
									? "justify-end"
									: "justify-start"
							}`}
						>
							<div
								className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
									msg.role === "user"
										? "bg-brand-600 text-white rounded-br-md"
										: "bg-gray-100 text-gray-800 rounded-bl-md"
								}`}
							>
								{msg.content}
							</div>
						</div>
					))}

					{isLoading && (
						<div className="flex justify-start">
							<div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-2xl rounded-bl-md text-sm">
								<span className="inline-flex gap-1 items-center">
									<span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
									<span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
									<span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
								</span>
							</div>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>

				{/* Input */}
				<div className="flex items-center gap-2 p-3 border-t border-gray-200 shrink-0">
					<input
						ref={inputRef}
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Type your message..."
						className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
						disabled={isLoading}
					/>
					<button
						onClick={sendMessage}
						disabled={isLoading || !input.trim()}
						className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
						aria-label="Send message"
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="22" y1="2" x2="11" y2="13" />
							<polygon points="22 2 15 22 11 13 2 9 22 2" />
						</svg>
					</button>
				</div>
			</div>

			{/* Floating button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`fixed bottom-4 right-4 z-[9999] w-14 h-14 bg-brand-600 text-white rounded-full shadow-lg hover:bg-brand-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
					isOpen ? "max-sm:hidden" : ""
				}`}
				aria-label="Open chat"
			>
				{isOpen ? (
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				) : (
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
					</svg>
				)}
			</button>
		</>
	);
}
