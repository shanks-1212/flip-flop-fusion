// script.js
function convert() {
    // Get input values
    let s = parseInt(document.getElementById('s1').value);
    let r = parseInt(document.getElementById('r1').value);
    let q = parseInt(document.getElementById('q1').value);
    
    // Validate inputs
    if (isNaN(s) || isNaN(r) || isNaN(q) || s > 1 || s < 0 || r > 1 || r < 0 || q > 1 || q < 0) {
        alert("Please enter valid binary values (0 or 1)");
        return;
    }

    // Calculate JK values
    let j, k, imageSrc;
    if (s === 0 && r === 0) {
        j = 0; k = 0;
        imageSrc = "sr_00.jpg";
    } else if (s === 0 && r === 1) {
        j = 0; k = 1;
        imageSrc = "sr_01.png";
    } else if (s === 1 && r === 0) {
        j = 1; k = 0;
        imageSrc = "sr_10.png";
    } else {
        j = 1; k = 1;
        imageSrc = "sr_11.png";
    }

    // Calculate next state
    let nextQ;
    if (j === 0 && k === 0) nextQ = q;
    else if (j === 0 && k === 1) nextQ = 0;
    else if (j === 1 && k === 0) nextQ = 1;
    else nextQ = q === 0 ? 1 : 0;

    // JK Output
    document.getElementById('jk-result').innerHTML = 
        `J = ${j}, K = ${k}<br>Current Q = ${q}<br>Next Q = ${nextQ}`;

    // Updated Verilog Code with dynamic S and R
    let verilogCode = `// Verilog Code for Flip-Flop Implementation
module logic_combiner (output logic res, input logic x, input logic y);
    assign res = x & y;  // AND operation
endmodule

module top (
    input logic clk,
    input logic reset,
    input logic [31:0] cycle_count,
    output logic test_passed,
    output logic test_failed
);
    logic sr_s = ${s}, sr_r = ${r}, sr_q;
    logic digital_s, digital_r;
    logic jk_q, j, k;

    // Analog to digital conversion
    assign digital_s = (sr_s > 1'b0) ? 1'b1 : 1'b0;
    assign digital_r = (sr_r > 1'b0) ? 1'b1 : 1'b0;

    // SR Flip-Flop Logic
    always_ff @(posedge clk or posedge reset) begin
        if (reset)
            sr_q <= 0;
        else if (digital_s & ~digital_r)
            sr_q <= 1;
        else if (~digital_s & digital_r)
            sr_q <= 0;
    end

    // Converting SR Flip-Flop to JK Flip-Flop behavior
    assign j = digital_s;
    assign k = digital_r;

    always_ff @(posedge clk or posedge reset) begin
        if (reset)
            jk_q <= 0;
        else if (j & ~k)
            jk_q <= 1;
        else if (~j & k)
            jk_q <= 0;
        else if (j & k)
            jk_q <= ~jk_q;
    end

    // Test logic based on JK flip-flop output
    assign test_passed = jk_q;
    assign test_failed = ~jk_q;
endmodule`;

    document.getElementById('verilog-code').textContent = verilogCode;

    // Image Output
    document.getElementById('image-output').innerHTML = `
        <h3>State Diagram</h3>
        <img src="op.jpg" alt="SR to JK Flip-Flop Case">
    `;
}