var canvas;
var context;

var m_x = 100;
var m_y = 100;

var m_down = 0;
var slide_grabbed = 0;
var cursor_grabbed = 0;
var int_id;

var S_ANGLE = 0;
var C_ANGLE = 0;

function init() {

    canvas = document.getElementById("canvas");

    if( canvas.getContext ) {

        context = canvas.getContext("2d");
        context.font = "20px";

        draw();
        
        //int_id = setInterval(draw,DT*100);
        
    }
}

function draw() {
    
    erase();

    context.save();

    context.translate(0.5,0.5);

    draw_stator();
    draw_slide();
    draw_cursor();

    context.restore();
    
}

function erase() {
    
    context.clearRect(-1,-1,canvas.width+2,canvas.height+2);
    
}

function draw_stator() {
    
    context.save();

    context.beginPath();
    context.arc(400,250,75,0,2*Math.PI,true);
    context.stroke();

    context.save();
    context.translate(400,250);
    draw_log_scale(0,2*Math.PI,75,-15);
    context.restore();
    
    context.beginPath();
    context.arc(400,250,180,0,2*Math.PI,true);
    context.stroke();

    context.beginPath();
    context.arc(400,250,250,0,2*Math.PI,true);
    context.stroke();

    context.save();
    context.translate(400,250);
    draw_log_scale(0,Math.PI,180,15);
    draw_log_scale(Math.PI,2*Math.PI,180,15);
    draw_exponent_scale(0,2*Math.PI,250,-15);
    context.restore();

    context.restore();
    
}

function draw_slide() {
    
    context.save();


    context.beginPath();
    context.arc(400,250,75,0,2*Math.PI,true);
    context.stroke();

    context.save();
    context.translate(400,250);
    context.rotate(S_ANGLE);
    draw_log_scale(0,2*Math.PI,75,15);
    draw_log_scale(0,Math.PI,180,-15);
    draw_log_scale(Math.PI,2*Math.PI,180,-15);
    draw_sin_scale(0,2*Math.PI,115,15);
    context.restore();

    context.restore();

}

function draw_cursor() {

    context.save();

    context.translate(400,250);
    context.rotate(C_ANGLE);

    context.beginPath();
    context.arc(0,0,30,-Math.PI,0,true);
    context.lineTo(30,-220);
    context.arc(0,-220,30,0,Math.PI,true);
    context.lineTo(-30,0);
    context.stroke();

    context.strokeStyle = "rgb(255,0,0)";
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(0,-220);
    context.stroke();

    context.restore();

}

function draw_log_scale(a1,a2,r1,w) {

    context.save();

    var t1;
    var t2;
    for( var i=1; i<=10; i++ ) {
        
        if( i < 10 )
            draw_log_scale_recursion(i,i+1,a1,a2,r1,w,1);
    	
        t1 = (a2-a1)*Math.log(i)/Math.LN10+a1;
        
        context.beginPath();
        context.moveTo(r1*Math.sin(t1),-r1*Math.cos(t1));
        context.lineTo((r1+w)*Math.sin(t1),-(r1+w)*Math.cos(t1));
        context.stroke();

        context.save();
        context.translate((r1+w+w/Math.abs(w)*8)*Math.sin(t1),-(r1+w+w/Math.abs(w)*8)*Math.cos(t1));
        context.rotate(t1);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "bold 15px/15px sans-serif";
        if( i < 10 )
            context.fillText(i,0,0);
        else
            context.fillText("1",0,0);
        context.restore();

    }

    context.restore();

}

function draw_log_scale_recursion(left,right,a1,a2,r1,w,depth) {

    if( depth >= 4 )
        return;
    
    context.save();

    var t1 = (a2-a1)*Math.log(left)/Math.LN10+a1;
    var t2 = (a2-a1)*Math.log(right)/Math.LN10+a1;

    if( r1*Math.abs(t2-t1) > 10 && depth%2 ) {

        draw_log_scale_recursion(left,left+(right-left)/5,a1,a2,r1,w,depth+1);
        
        for( var i=1; i<=4; i++ ) {
            t1 = (a2-a1)*Math.log((right-left)/5*i+left)/Math.LN10+a1;
            context.beginPath();
            context.moveTo(r1*Math.sin(t1),-r1*Math.cos(t1));
            context.lineTo((r1+(1-depth/4)*w)*Math.sin(t1),-(r1+(1-depth/4)*w)*Math.cos(t1));
            context.stroke();
            draw_log_scale_recursion(
                (right-left)/5*i+left,
                (right-left)/5*(i+1)+left,
                a1,a2,r1,w,depth+1);
        }
    } else if( r1*Math.abs(t2-t1) > 4.9 && !(depth%2) ) {
        
        t1 = (a2-a1)*Math.log((left+right)/2)/Math.LN10+a1;
        context.beginPath();
        context.moveTo(r1*Math.sin(t1),-r1*Math.cos(t1));
        context.lineTo((r1+(1-depth/4)*w)*Math.sin(t1),-(r1+(1-depth/4)*w)*Math.cos(t1));
        context.stroke();
        
        draw_log_scale_recursion(left,(left+right)/2,a1,a2,r1,w,depth+1);
        draw_log_scale_recursion((left+right)/2,right,a1,a2,r1,w,depth+1);
        
    }

    context.restore();
    
}

function draw_sin_scale(a1,a2,r,w) {

    context.save();

    var t1;
    for( var i=6; i<10; i++ ) {
        
        t1 = (a2-a1)*Math.log(10*Math.sin(i*Math.PI/180))/Math.LN10+a1;

        context.beginPath();
        context.moveTo(r*Math.sin(t1),-r*Math.cos(t1));
        context.lineTo((r+w)*Math.sin(t1),-(r+w)*Math.cos(t1));
        context.stroke();

        context.save();
        context.translate((r+w+w/Math.abs(w)*8)*Math.sin(t1),-(r+w+w/Math.abs(w)*8)*Math.cos(t1));
        context.rotate(t1);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "bold 10px/10px sans-serif";
        context.fillText(i,0,0);
        context.restore();
                         
        draw_sin_scale_recursion(i,i+1,a1,a2,r,w,1,1);

    }

    for( var i=10; i<50; i+=5 ) {
        
        t1 = (a2-a1)*Math.log(10*Math.sin(i*Math.PI/180))/Math.LN10+a1;

        context.beginPath();
        context.moveTo(r*Math.sin(t1),-r*Math.cos(t1));
        context.lineTo((r+w)*Math.sin(t1),-(r+w)*Math.cos(t1));
        context.stroke();
        
        context.save();
        context.translate((r+w+w/Math.abs(w)*8)*Math.sin(t1),-(r+w+w/Math.abs(w)*8)*Math.cos(t1));
        context.rotate(t1);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "bold 10px/10px sans-serif";
        context.fillText(i,0,0);
        context.restore();

        draw_sin_scale_recursion(i,i+5,a1,a2,r,w,1,0);

    }

    for( var i=50; i<70; i+=10 ) {
        
        t1 = (a2-a1)*Math.log(10*Math.sin(i*Math.PI/180))/Math.LN10+a1;

        context.beginPath();
        context.moveTo(r*Math.sin(t1),-r*Math.cos(t1));
        context.lineTo((r+w)*Math.sin(t1),-(r+w)*Math.cos(t1));
        context.stroke();
        
        context.save();
        context.translate((r+w+w/Math.abs(w)*8)*Math.sin(t1),-(r+w+w/Math.abs(w)*8)*Math.cos(t1));
        context.rotate(t1);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "bold 10px/10px sans-serif";
        context.fillText(i,0,0);
        context.restore();

        draw_sin_scale_recursion(i,i+10,a1,a2,r,w,1,1);

    }

    for( var i=70; i<90; i+=20 ) {
        
        t1 = (a2-a1)*Math.log(10*Math.sin(i*Math.PI/180))/Math.LN10+a1;

        context.beginPath();
        context.moveTo(r*Math.sin(t1),-r*Math.cos(t1));
        context.lineTo((r+w)*Math.sin(t1),-(r+w)*Math.cos(t1));
        context.stroke();
        
        context.save();
        context.translate((r+w+w/Math.abs(w)*8)*Math.sin(t1),-(r+w+w/Math.abs(w)*8)*Math.cos(t1));
        context.rotate(t1);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "bold 10px/10px sans-serif";
        context.fillText(i,0,0);
        context.restore();

        draw_sin_scale_recursion(i,i+20,a1,a2,r,w,1,1);

    }

    context.beginPath();
    context.moveTo(r*Math.sin(a2),-r*Math.cos(a2));
    context.lineTo((r+w)*Math.sin(a2),-(r+w)*Math.cos(a2));
    context.stroke();
    
    context.save();
    context.translate((r+w+w/Math.abs(w)*8)*Math.sin(a2),-(r+w+w/Math.abs(w)*8)*Math.cos(a2));
    context.rotate(a2);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "bold 10px/10px sans-serif";
    context.fillText("90",0,0);
    context.restore();

    context.restore();
    
}

function draw_sin_scale_recursion(left,right,a1,a2,r,w,depth,flag) {

    if( depth >= 4+flag )
        return;
    
    context.save();

    var t1 = (a2-a1)*Math.log(10*Math.sin(left*Math.PI/180))/Math.LN10+a1;
    var t2 = (a2-a1)*Math.log(10*Math.sin(right*Math.PI/180))/Math.LN10+a1;

    if( r*Math.abs(t2-t1) > 10 && (depth+flag)%2 == 1 ) {

        draw_sin_scale_recursion(left,left+(right-left)/5,a1,a2,r,w,depth+1,flag%2);
        
        for( var i=1; i<=4; i++ ) {
            t1 = (a2-a1)*Math.log(10*Math.sin(((right-left)/5*i+left)*Math.PI/180))/Math.LN10+a1;
            t2 = (a2-a1)*Math.log(10*Math.sin(((right-left)/5*(i+1)+left)*Math.PI/180))/Math.LN10+a1;
            context.beginPath();
            context.moveTo(r*Math.sin(t1),-r*Math.cos(t1));
            context.lineTo((r+(1-depth/4)*w)*Math.sin(t1),-(r+(1-depth/4)*w)*Math.cos(t1));
            context.stroke();
            draw_sin_scale_recursion(
                (right-left)/5*i+left,
                (right-left)/5*(i+1)+left,
                a1,a2,r,w,depth+1,flag%2);
        }
    } else if( r*Math.abs(t2-t1) > 5 && (depth+flag)%2 == 0 ) {
        
        t1 = (a2-a1)*Math.log(10*Math.sin((left+right)/2*Math.PI/180))/Math.LN10+a1;
        context.beginPath();
        context.moveTo(r*Math.sin(t1),-r*Math.cos(t1));
        context.lineTo((r+(1-depth/4)*w)*Math.sin(t1),-(r+(1-depth/4)*w)*Math.cos(t1));
        context.stroke();
        
        draw_sin_scale_recursion(left,(left+right)/2,a1,a2,r,w,depth+1,flag);
        draw_sin_scale_recursion((left+right)/2,right,a1,a2,r,w,depth+1,flag);
        
    }

    context.restore();
    
    
}

function draw_exponent_scale(a1,a2,r,w) {

    context.save();

    var t1;
    var t2;
    var h = Math.log(10)/10;
    for( var i=0; i<Math.LN10-0.1; i+=0.1 ) {
        
        //if( i < 10 )
        //draw_log_scale_recursion(i,i+1,a1,a2,r1,w,1);
    	
        t1 = (a2-a1)*i/Math.LN10+a1;
        
        context.beginPath();
        context.moveTo(r*Math.sin(t1),-r*Math.cos(t1));
        context.lineTo((r+w)*Math.sin(t1),-(r+w)*Math.cos(t1));
        context.stroke();

        context.save();
        context.translate((r+w+w/Math.abs(w)*8)*Math.sin(t1),-(r+w+w/Math.abs(w)*8)*Math.cos(t1));
        context.rotate(t1);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "bold 15px/15px sans-serif";
        context.fillText(sprintf("%.2f",i),0,0);
        context.restore();

    }

    context.restore();    

}

function mouse_down(event) {

    m_down = 1;
    m_x = event.clientX-9;
    m_y = event.clientY-9;

    var r = Math.sqrt((m_x-400)*(m_x-400)+(m_y-250)*(m_y-250));

    var d1 = (220*Math.sin(C_ANGLE)*(250-m_y)-(400-m_x)*(-220*Math.cos(C_ANGLE)))/220;
    var d1prime = Math.sqrt((110*Math.sin(C_ANGLE)+400-m_x)*(110*Math.sin(C_ANGLE)+400-m_x)
                    	    +(-110*Math.cos(C_ANGLE)+250-m_y)*(-110*Math.cos(C_ANGLE)+250-m_y));
    var d2 = Math.sqrt((m_x-400)*(m_x-400)+(m_y-250)*(m_y-250));
    var d3 = Math.sqrt((220*Math.sin(C_ANGLE)+400-m_x)*(220*Math.sin(C_ANGLE)+400-m_x)
                    	 +(-220*Math.cos(C_ANGLE)+250-m_y)*(-220*Math.cos(C_ANGLE)+250-m_y));
    
    if( (Math.abs(d1) < 30 && d1prime < 110) || d2 < 30 || d3 < 30 ) {
        cursor_grabbed = 1;
    } else if( r > 75 && r < 180 ) {
        slide_grabbed = 1;
    }

}

function mouse_up(event) {
    
    m_down = 0;
    slide_grabbed = 0;
    cursor_grabbed = 0;

}

function mouse_move(event) {

    var t1 = Math.atan2(250-m_y,m_x-400);
    var t2 = Math.atan2(250-(event.clientY-9),event.clientX-9-400);
    m_x = event.clientX-9;
    m_y = event.clientY-9;

    if( m_down && cursor_grabbed ) {
        C_ANGLE += t1-t2;
        draw();
        draw();
    } else if( m_down && slide_grabbed ) {
        S_ANGLE += t1-t2;
        draw();
        draw();
    }

}

function mouse_click(event) {

}

function key_press(event) {

    var code = event.keyCode?event.keyCode:event.which;

    switch( code) {
    case 112:
        if( paused == 0 ) {
            clearInterval(int_id);
            paused = 1;
        }	else {
            int_id = setInterval(draw,DT*100);
            paused = 0;
        }
        break;
    }

}
