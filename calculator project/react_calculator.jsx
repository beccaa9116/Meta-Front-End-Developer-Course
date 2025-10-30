import { useEffect, useRef, useState } from "react";

// Single-file React calculator using Tailwind classes.
// Drop this component into a CRA/Vite project and render <CalculatorApp />
// in your App.jsx/tsx. No external libs, no eval().

export default function CalculatorApp() {
  // Core state
  const [display, setDisplay] = useState("0"); // string to preserve user input formatting
  const [operand, setOperand] = useState<number | null>(null);
  const [op, setOp] = useState<"+" | "-" | "×" | "÷" | null>(null);
  const [overwrite, setOverwrite] = useState(false); // start new entry after operator/equals

  const containerRef = useRef<HTMLDivElement>(null);

  // Utilities
  const clampLen = (s: string, max = 12) => (s.length > max ? Number(s).toExponential(6) : s);
  const isZero = (s: string) => /^0(\.0+)?$/.test(s);

  const inputDigit = (d: string) => {
    setDisplay((prev) => {
      if (overwrite || prev === "Error") {
        setOverwrite(false);
        return d === "." ? "0." : d;
      }
      if (d === ".") {
        return prev.includes(".") ? prev : prev + ".";
      }
      if (prev === "0") return d; // replace leading zero
      return clampLen(prev + d);
    });
  };

  const chooseOp = (nextOp: "+" | "-" | "×" | "÷") => {
    setDisplay((prev) => {
      const current = parseFloat(prev);
      if (op && operand != null && !overwrite) {
        const res = compute(operand, current, op);
        setOperand(res === Infinity || isNaN(res) ? null : res);
        setOp(nextOp);
        setOverwrite(true);
        return (res === Infinity || isNaN(res)) ? "Error" : clampLen(String(res));
      }
      setOperand(current);
      setOp(nextOp);
      setOverwrite(true);
      return clampLen(prev);
    });
  };

  const compute = (a: number, b: number, operator: "+" | "-" | "×" | "÷") => {
    switch (operator) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? Infinity : a / b;
    }
  };

  const equals = () => {
    setDisplay((prev) => {
      if (op == null || operand == null) return clampLen(prev);
      const current = parseFloat(prev);
      const res = compute(operand, current, op);
      setOperand(null);
      setOp(null);
      setOverwrite(true);
      return (res === Infinity || isNaN(res)) ? "Error" : clampLen(String(res));
    });
  };

  const clearAll = () => {
    setDisplay("0");
    setOperand(null);
    setOp(null);
    setOverwrite(false);
  };

  const del = () => {
    setDisplay((prev) => {
      if (overwrite || prev === "Error") { setOverwrite(false); return "0"; }
      if (prev.length <= 1) return "0";
      if (prev.length === 2 && prev.startsWith("-")) return "0";
      return prev.slice(0, -1);
    });
  };

  const toggleSign = () => setDisplay((prev) => (prev === "0" || prev === "Error") ? prev : (prev.startsWith("-") ? prev.slice(1) : "-" + prev));

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (/^[0-9]$/.test(k)) return inputDigit(k);
      if (k === ".") return inputDigit(".");
      if (k === "+") return chooseOp("+");
      if (k === "-") return chooseOp("-");
      if (k === "*") return chooseOp("×");
      if (k === "/") return chooseOp("÷");
      if (k === "Enter" || k === "=") return equals();
      if (k === "Backspace") return del();
      if (k.toLowerCase() === "c") return clearAll();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [operand, op, overwrite]);

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl shadow-2xl bg-slate-800/80 border border-slate-700">
        {/* Display */}
        <div className="px-5 pt-5">
          <div aria-live="polite" className="text-right text-4xl font-semibold tabular-nums tracking-tight min-h-[3.25rem]">
            {display}
          </div>
          <div className="flex justify-between items-center text-sm text-slate-400 mt-1">
            <div>React Calculator</div>
            <div className="font-medium">{op ?? ""}</div>
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2 p-4">
          <CalcButton onClick={clearAll} variant="sub">AC</CalcButton>
          <CalcButton onClick={del} variant="sub">DEL</CalcButton>
          <CalcButton onClick={toggleSign} variant="sub">±</CalcButton>
          <CalcButton onClick={() => chooseOp("÷")} ariaLabel="divide" variant="op">÷</CalcButton>

          <CalcButton onClick={() => inputDigit("7")}>7</CalcButton>
          <CalcButton onClick={() => inputDigit("8")}>8</CalcButton>
          <CalcButton onClick={() => inputDigit("9")}>9</CalcButton>
          <CalcButton onClick={() => chooseOp("×")} ariaLabel="multiply" variant="op">×</CalcButton>

          <CalcButton onClick={() => inputDigit("4")}>4</CalcButton>
          <CalcButton onClick={() => inputDigit("5")}>5</CalcButton>
          <CalcButton onClick={() => inputDigit("6")}>6</CalcButton>
          <CalcButton onClick={() => chooseOp("-")} ariaLabel="subtract" variant="op">−</CalcButton>

          <CalcButton onClick={() => inputDigit("1")}>1</CalcButton>
          <CalcButton onClick={() => inputDigit("2")}>2</CalcButton>
          <CalcButton onClick={() => inputDigit("3")}>3</CalcButton>
          <CalcButton onClick={() => chooseOp("+")} ariaLabel="add" variant="op">+</CalcButton>

          <CalcButton className="col-span-2" onClick={() => inputDigit("0")}>0</CalcButton>
          <CalcButton onClick={() => inputDigit(".")}>.</CalcButton>
          <CalcButton onClick={equals} ariaLabel="equals" variant="eq">=</CalcButton>
        </div>
      </div>
    </div>
  );
}

function CalcButton({
  children,
  onClick,
  ariaLabel,
  variant,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel?: string;
  variant?: "op" | "eq" | "sub";
  className?: string;
}) {
  const base =
    "select-none rounded-xl py-3 text-xl font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-400 ring-offset-slate-800 active:translate-y-[1px] transition transform";
  const variants: Record<string, string> = {
    default: "bg-slate-700 hover:bg-slate-600",
    op: "bg-indigo-600 hover:bg-indigo-500",
    eq: "bg-amber-500 hover:bg-amber-400 text-slate-900",
    sub: "bg-slate-600 hover:bg-slate-500 text-slate-200",
  };
  const v = variant ? variants[variant] : variants.default;
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`${base} ${v} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}