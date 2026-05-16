import { memo } from "react";

const GRADIENTS = [
  "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
  "linear-gradient(135deg, #2d1b69, #11998e)",
  "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
  "linear-gradient(135deg, #141e30, #243b55)",
  "linear-gradient(135deg, #1f1c2c, #928DAB)",
  "linear-gradient(135deg, #0B486B, #F56217)",
  "linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)",
  "linear-gradient(135deg, #232526, #414345)",
  "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  "linear-gradient(135deg, #4a0e4e, #321450)",
];

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function AlbumArt({ track, size = 48, style: extraStyle = {}, className = "" }) {
  // If track has a real cover image, show it
  if (track?.coverUrl) {
    return (
      <img
        src={track.coverUrl}
        alt={track.title}
        loading="lazy"
        className={className}
        style={{
          width: size,
          height: size,
          minWidth: size,
          borderRadius: size > 80 ? 8 : 4,
          objectFit: "cover",
          boxShadow: size > 80 ? "0 8px 32px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.3)",
          ...extraStyle,
        }}
      />
    );
  }

  // Generate procedural art based on track info
  const seed = hashCode(track?.id || track?.title || "default");
  const hue = seed % 360;
  const shape = seed % 5;
  const gradient = GRADIENTS[seed % GRADIENTS.length];

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: size > 80 ? 8 : 4,
        background: gradient,
        position: "relative",
        overflow: "hidden",
        boxShadow: size > 80 ? "0 8px 32px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.3)",
        ...extraStyle,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", top: 0, left: 0 }}>
        {shape === 0 && (
          <>
            <circle cx="50" cy="50" r="35" fill="none" stroke={`hsla(${hue},70%,70%,0.3)`} strokeWidth="2" />
            <circle cx="50" cy="50" r="20" fill={`hsla(${hue},80%,60%,0.2)`} />
            <circle cx="50" cy="50" r="8" fill={`hsla(${hue},80%,80%,0.4)`} />
          </>
        )}
        {shape === 1 && (
          <>
            <rect x="15" y="15" width="70" height="70" rx="8" fill="none" stroke={`hsla(${hue},70%,70%,0.25)`} strokeWidth="2" transform="rotate(15 50 50)" />
            <rect x="25" y="25" width="50" height="50" rx="4" fill={`hsla(${hue},80%,60%,0.15)`} transform="rotate(30 50 50)" />
          </>
        )}
        {shape === 2 && (
          <>
            <polygon points="50,10 90,75 10,75" fill="none" stroke={`hsla(${hue},70%,70%,0.3)`} strokeWidth="2" />
            <polygon points="50,30 75,65 25,65" fill={`hsla(${hue},80%,60%,0.15)`} />
          </>
        )}
        {shape === 3 && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={10 + i * 20} y1="0" x2={10 + i * 20} y2="100" stroke={`hsla(${hue},70%,70%,0.15)`} strokeWidth="3" />
            ))}
            <circle cx="50" cy="50" r="25" fill={`hsla(${hue},80%,70%,0.2)`} />
          </>
        )}
        {shape === 4 && (
          <>
            <path d={`M0,50 Q25,${20 + (seed % 30)} 50,50 T100,50`} fill="none" stroke={`hsla(${hue},70%,70%,0.3)`} strokeWidth="3" />
            <path d={`M0,60 Q25,${30 + (seed % 30)} 50,60 T100,60`} fill="none" stroke={`hsla(${hue},70%,70%,0.2)`} strokeWidth="2" />
            <path d={`M0,40 Q25,${10 + (seed % 30)} 50,40 T100,40`} fill="none" stroke={`hsla(${hue},70%,70%,0.2)`} strokeWidth="2" />
          </>
        )}
      </svg>
    </div>
  );
}

export default memo(AlbumArt);
