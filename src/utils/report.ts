import { Assessment } from "@/types";
import { klDivergence, jsDivergence, earthMoversDistance } from "@/utils/mockData";

// Helper: base64 encode an SVG string safely
const svgToBase64 = (svg: string) => {
  // Encode UTF-8 properly before btoa
  return btoa(unescape(encodeURIComponent(svg)));
};

// Helper: simple variance
const variance = (arr: number[]) => {
  if (arr.length === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return arr.reduce((sum, v) => sum + (v - mean) * (v - mean), 0) / arr.length;
};

// Build a simple overlapping histogram SVG for two distributions
const buildHistogramSVG = (ai: number[], persona: number[]): string => {
  const width = 800;
  const height = 400;
  const padding = 40;
  const bins = 20;
  const all = [...ai, ...persona];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = max - min || 1; // avoid 0 range

  const binCounts = (data: number[]) => {
    const counts = Array(bins).fill(0);
    data.forEach((v) => {
      let idx = Math.floor(((v - min) / range) * bins);
      if (idx === bins) idx = bins - 1;
      counts[idx] += 1;
    });
    // Normalize to density
    const total = data.length || 1;
    return counts.map((c) => c / total);
  };

  const aiCounts = binCounts(ai);
  const personaCounts = binCounts(persona);
  const yMax = Math.max(...aiCounts, ...personaCounts) || 1;

  const binWidth = (width - 2 * padding) / bins;

  const aiBars = aiCounts
    .map((c, i) => {
      const x = padding + i * binWidth;
      const h = (c / yMax) * (height - 2 * padding);
      const y = height - padding - h;
      return `<rect x="${x}" y="${y}" width="${binWidth - 2}" height="${h}" fill="#2F80ED" fill-opacity="0.35" />`;
    })
    .join("");

  const personaBars = personaCounts
    .map((c, i) => {
      const x = padding + i * binWidth + binWidth * 0.2; // slight offset
      const h = (c / yMax) * (height - 2 * padding);
      const y = height - padding - h;
      const w = binWidth - 2;
      return `<rect x="${x}" y="${y}" width="${w * 0.6}" height="${h}" fill="#EB5757" fill-opacity="0.35" />`;
    })
    .join("");

  // Axes and labels
  const axis = `
    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#888" stroke-width="1" />
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#888" stroke-width="1" />
    <text x="${width / 2}" y="${height - 10}" text-anchor="middle" font-size="12" fill="#666">Score</text>
    <text x="15" y="${height / 2}" transform="rotate(-90, 15, ${height / 2})" text-anchor="middle" font-size="12" fill="#666">Density</text>
  `;

  const legend = `
    <rect x="${width - padding - 200}" y="${padding - 25}" width="12" height="12" fill="#2F80ED" fill-opacity="0.6" />
    <text x="${width - padding - 180}" y="${padding - 14}" font-size="12" fill="#444">AI Model Score</text>
    <rect x="${width - padding - 200}" y="${padding - 8}" width="12" height="12" fill="#EB5757" fill-opacity="0.6" />
    <text x="${width - padding - 180}" y="${padding + 3}" font-size="12" fill="#444">Biased Human Score</text>
  `;

  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Score Distribution">
    <rect x="0" y="0" width="100%" height="100%" fill="#ffffff" />
    ${axis}
    ${aiBars}
    ${personaBars}
    ${legend}
  </svg>`;
};

// Build a simple line chart SVG for historical accuracies
const buildTrendSVG = (accuracies: number[]): string => {
  const width = 800;
  const height = 400;
  const padding = 40;
  const n = accuracies.length;
  const xStep = (width - 2 * padding) / Math.max(1, n - 1);

  const points = accuracies
    .map((val, i) => {
      const x = padding + i * xStep;
      const y = height - padding - val * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(" ");

  const baselineY = height - padding - 0.5 * (height - 2 * padding);

  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="User Accuracy Trend">
    <rect x="0" y="0" width="100%" height="100%" fill="#ffffff" />
    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#888" stroke-width="1" />
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#888" stroke-width="1" />
    <line x1="${padding}" y1="${baselineY}" x2="${width - padding}" y2="${baselineY}" stroke="#bbb" stroke-width="1" stroke-dasharray="4 4" />
    <polyline fill="none" stroke="#3498db" stroke-width="2" points="${points}" />
    ${accuracies
      .map((val, i) => {
        const x = padding + i * xStep;
        const y = height - padding - val * (height - 2 * padding);
        return `<circle cx="${x}" cy="${y}" r="3" fill="#3498db" />`;
      })
      .join("")}
    <text x="${width / 2}" y="${height - 10}" text-anchor="middle" font-size="12" fill="#666">Trial Number</text>
    <text x="15" y="${height / 2}" transform="rotate(-90, 15, ${height / 2})" text-anchor="middle" font-size="12" fill="#666">User Accuracy</text>
  </svg>`;
};

export const generateComplianceReport = (assessments: Assessment[]): string => {
  const n = assessments.length;
  const correct = assessments.filter((a) => a.correct === 1).length;
  const accuracy = n > 0 ? correct / n : 0;

  const aiScores = assessments.map((a) => a.ai_score);
  const personaScores = assessments.map((a) => a.persona_score);

  const kl = klDivergence(aiScores, personaScores);
  const js = jsDivergence(aiScores, personaScores);
  const emd = earthMoversDistance(aiScores, personaScores);

  const now = new Date().toISOString().replace("T", " ").replace(/\..+/, " UTC");

  // Bias scorecard mapping based on KL Divergence (lower => higher risk)
  let biasScorecard = "";
  let biasColor = "";
  let biasExplanation = "";
  if (kl < 0.1) {
    biasScorecard = "High Bias Detected";
    biasColor = "#dc3545"; // red
    biasExplanation = "The AI's scoring distribution is very similar to the biased judge's. This is a high-risk finding, suggesting the AI has learned and replicated the human bias. Immediate action is recommended to identify the source of the bias in the AI model.";
  } else if (kl < 0.5) {
    biasScorecard = "Moderate Bias Detected";
    biasColor = "#ffc107"; // yellow
    biasExplanation = "The AI's scoring distribution shows some similarity to the biased judge's. This indicates a potential risk of unfair outcomes that should be investigated to ensure equitable results for all candidates.";
  } else {
    biasScorecard = "Low Bias Detected";
    biasColor = "#28a745"; // green
    biasExplanation = "The AI's scoring distribution is significantly different from the biased judge's. This suggests a lower risk of replicating this specific human bias, though continuous monitoring is always recommended for fairness.";
  }

  // Charts
  let scoreDistBase64 = "";
  if (variance(aiScores) > 0 || variance(personaScores) > 0) {
    const svg = buildHistogramSVG(aiScores, personaScores);
    scoreDistBase64 = svgToBase64(svg);
  } else {
    scoreDistBase64 = ""; // will show message
  }

  const historicalAccuracies: number[] = [];
  let currentCorrect = 0;
  for (let i = 0; i < n; i++) {
    if (assessments[i].correct === 1) currentCorrect += 1;
    historicalAccuracies.push(currentCorrect / (i + 1));
  }

  let trendBase64 = "";
  if (historicalAccuracies.length > 1) {
    const svg = buildTrendSVG(historicalAccuracies);
    trendBase64 = svgToBase64(svg);
  } else {
    trendBase64 = ""; // will show message
  }

  const html = `
  <html>
  <head>
    <meta charset="utf-8" />
    <title>AI Fairness Audit Report</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      body { font-family: 'Inter', sans-serif; margin: 2em; line-height: 1.6; color: #444; background-color: #f9f9fc; }
      .container { max-width: 900px; margin: 0 auto; background-color: #ffffff; padding: 2em; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
      h1 { color: #2c3e50; font-weight: 700; border-bottom: 3px solid #3498db; padding-bottom: 0.5em; }
      h2 { color: #34495e; font-weight: 600; margin-top: 1.5em; border-bottom: 1px solid #ecf0f1; padding-bottom: 0.3em; }
      .metric-table { width: 100%; border-collapse: collapse; margin-top: 1.5em; }
      .metric-table th, .metric-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
      .metric-table th { background-color: #f8f9fa; color: #555; }
      .metric-table tr:hover { background-color: #f1f1f1; }
      .section { margin-bottom: 2.5em; padding: 1.5em; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); background-color: #fafafa; }
      .bias-scorecard { font-size: 1.8em; font-weight: bold; padding: 0.7em 1em; border-radius: 8px; color: white; text-align: center; margin-top: 1em; background-color: ${biasColor}; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
      .explanation { font-size: 0.9em; color: #7f8c8d; font-style: italic; margin-top: 0.5em; }
      .chart-container { text-align: center; margin-top: 2em; }
      img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
      .footer { text-align: center; font-size: 0.8em; color: #999; margin-top: 3em; border-top: 1px solid #eee; padding-top: 1em; }
    </style>
    <link rel="canonical" href="about:blank" />
  </head>
  <body>
    <div class="container">
      <h1>AI Fairness & Bias Audit Report</h1>
      <p>
        This report provides a detailed analysis of the fairness of an AI hiring model. It compares the AI's scoring behavior against that of a known biased judge to identify potential risks and guide mitigation strategies.
      </p>
      <p style="text-align: right; font-style: italic; color: #888;">Report Generated: ${now}</p>

      <div class="section">
        <h2>Executive Summary</h2>
        <p>
          This audit tested the AI's hiring decisions against a human judge with a known, specific bias. Key findings include:
        </p>
        <ul style="list-style-type: disc; padding-left: 20px;">
          <li>User Accuracy: The human tester could correctly identify the biased judge <b>${(accuracy * 100).toFixed(2)}%</b> of the time. A user accuracy near 50% suggests that it was difficult for a human to distinguish the AI's scoring from the biased judge's, which is a high-risk finding.</li>
          <li>Bias Detection: The statistical metrics and visualizations in this report quantify the degree to which the AI's decisions align with the biased human's.</li>
          <li>Risk Assessment: The overall <b>Bias Scorecard</b> indicates the level of risk associated with this specific type of bias, based on the findings.</li>
        </ul>
      </div>

      <div class="section">
        <h2>Bias Scorecard</h2>
        <div class="bias-scorecard">${biasScorecard}</div>
        <p class="explanation">${biasExplanation}</p>
      </div>

      <div class="section">
        <h2>Quantitative Bias Metrics</h2>
        <p>
          These metrics measure the statistical similarity between the AI's score distribution and the biased human's. A lower value for these metrics indicates a greater risk that the AI's scoring pattern mirrors the human bias.
        </p>
        <table class="metric-table">
          <tr><th>Metric</th><th>Value</th><th>Interpretation</th></tr>
          <tr>
            <td>KL Divergence</td>
            <td>${Number.isFinite(kl) ? kl.toFixed(4) : "N/A"}</td>
            <td>Measures how one score distribution differs from the other. A value close to 0 suggests the AI and human scores are highly similar.</td>
          </tr>
          <tr>
            <td>JS Divergence</td>
            <td>${Number.isFinite(js) ? js.toFixed(4) : "N/A"}</td>
            <td>A symmetrical and more stable version of KL Divergence. It provides a reliable measure of similarity between the two scoring distributions.</td>
          </tr>
          <tr>
            <td>Earth Mover’s Distance</td>
            <td>${Number.isFinite(emd) ? emd.toFixed(4) : "N/A"}</td>
            <td>Represents the minimum effort required to transform one distribution into the other. A low value means the distributions are very much alike.</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <h2>Visual Analysis</h2>
        <p>The following charts provide a visual summary of the audit findings, making it easy to understand the results at a glance.</p>
        <div class="chart-container">
          <h3>Score Distribution: AI vs. Biased Human</h3>
          <p>This graph shows the frequency of scores at each level, highlighting similarities and differences between the AI and the biased judge.</p>
          ${scoreDistBase64
            ? `<img src="data:image/svg+xml;base64,${scoreDistBase64}" alt="Score Distribution Chart" />`
            : `<p style="color:#dc3545;">Score distribution could not be plotted due to a lack of variance in the data.</p>`}
        </div>
        <div class="chart-container">
          <h3>User's Ability to Spot Bias Over Time</h3>
          <p>This chart tracks the user's accuracy in identifying the biased judge with each new trial. A flat or declining trend may suggest the bias is particularly hard to spot.</p>
          ${trendBase64
            ? `<img src="data:image/svg+xml;base64,${trendBase64}" alt="User Accuracy Trend Chart" />`
            : `<p style="color:#ffc107;">More than one trial is needed to plot the user accuracy trend.</p>`}
        </div>
      </div>

      <div class="section">
        <h2>Alignment with Ethical & Regulatory Standards</h2>
        <p>This audit evaluates the AI system against established regulatory and ethical frameworks.</p>
        <h3>NYC Automated Employment Decision Tools (AEDT) - Local Law 144</h3>
        <p>
          The methodology of this audit aligns with the principles of NYC Local Law 144, which requires a "bias audit" to ensure fairness. By comparing the AI's impact on candidates to that of a biased benchmark, we can identify and address disparities in hiring decisions.
        </p>
        <h3>NIST AI Risk Management Framework (AI RMF)</h3>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><b><span style="color:#3498db;">Map:</span></b> The audit identifies and categorizes the source of potential bias (e.g., specific educational institutions).</li>
          <li><b><span style="color:#3498db;">Measure:</span></b> It uses quantitative metrics to measure the degree of bias, providing a data-driven approach to risk assessment.</li>
          <li><b><span style="color:#3498db;">Manage:</span></b> The findings provide the necessary information to manage and mitigate bias risks effectively, ensuring the system operates ethically.</li>
        </ul>
        <h3>EEOC Audit Readiness</h3>
        <p>
          The audit identifies potential risks that could lead to disparate impact, a key concern for the U.S. Equal Employment Opportunity Commission (EEOC). The findings can be used to document due diligence and support continuous monitoring, helping to ensure compliance and fair hiring practices.
        </p>
      </div>

      <div class="footer">
        <p>Confidential & Proprietary. Not for external distribution without permission.</p>
      </div>
    </div>
  </body>
  </html>`;

  return html;
};
