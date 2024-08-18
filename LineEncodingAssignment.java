import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class LineEncodingAssignment extends JFrame {

    private JTextField dataInput;
    private final int unitWidth = 40;
    private final int midHeight = 75;
    private final int highLevel = 25;
    private final int lowLevel = 125;

    public LineEncodingAssignment() {
        setTitle("Line Encoding Assignment");
        setSize(550, 800);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new FlowLayout());

        JLabel label = new JLabel("Enter Binary Data Sequence: ");
        dataInput = new JTextField("01001110", 20);
        JButton encodeButton = new JButton("Encode Data");

        encodeButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                repaint();
            }
        });

        add(label);
        add(dataInput);
        add(encodeButton);
    }

    @Override
    public void paint(Graphics g) {
        super.paint(g);

        String data = dataInput.getText();

        drawEncoding(g, data, "Unipolar Encoding", 100, this::drawUnipolar);
        drawEncoding(g, data, "Polar NRZ-I Encoding", 250, this::drawNRZI);
        drawEncoding(g, data, "Polar NRZ-L Encoding", 400, this::drawNRZL);
        drawEncoding(g, data, "Manchester Encoding", 550, this::drawManchester);
        drawEncoding(g, data, "Differential Manchester Encoding", 700, this::drawDifferentialManchester);
    }

    private void drawEncoding(Graphics g, String data, String title, int yOffset, EncodingDrawer drawer) {
        g.setColor(Color.BLACK);
        g.drawString(title, 40, yOffset - 10);
        g.drawLine(40, yOffset + highLevel, 500, yOffset + highLevel);  // +V level
        g.drawLine(40, yOffset + midHeight, 500, yOffset + midHeight);  // 0 level
        g.drawLine(40, yOffset + lowLevel, 500, yOffset + lowLevel);    // -V level

        drawer.draw(g, data, yOffset);
    }

    private void drawUnipolar(Graphics g, String data, int yOffset) {
        int y = yOffset + midHeight;
        int x = 40;
        for (int i = 0; i < data.length(); i++) {
            int bit = data.charAt(i) - '0';
            y = bit == 1 ? yOffset + highLevel : yOffset + midHeight;
            g.drawLine(x, y, x + unitWidth, y);
            g.drawLine(x + unitWidth, y, x + unitWidth, yOffset + midHeight);
            x += unitWidth;
        }
    }

    private void drawNRZI(Graphics g, String data, int yOffset) {
        int y = yOffset + highLevel;
        int x = 40;
        for (int i = 0; i < data.length(); i++) {
            if (data.charAt(i) == '1') {
                y = (y == yOffset + highLevel) ? yOffset + lowLevel : yOffset + highLevel;
            }
            g.drawLine(x, y, x + unitWidth, y);
            x += unitWidth;
        }
    }

    private void drawNRZL(Graphics g, String data, int yOffset) {
        int y;
        int x = 40;
        for (int i = 0; i < data.length(); i++) {
            y = data.charAt(i) == '1' ? yOffset + lowLevel : yOffset + highLevel;
            g.drawLine(x, y, x + unitWidth, y);
            x += unitWidth;
        }
    }

    private void drawManchester(Graphics g, String data, int yOffset) {
        int x = 40;
        for (int i = 0; i < data.length(); i++) {
            int midX = x + unitWidth / 2;
            if (data.charAt(i) == '0') {
                g.drawLine(x, yOffset + midHeight, midX, yOffset + lowLevel);
                g.drawLine(midX, yOffset + lowLevel, x + unitWidth, yOffset + highLevel);
            } else {
                g.drawLine(x, yOffset + midHeight, midX, yOffset + highLevel);
                g.drawLine(midX, yOffset + highLevel, x + unitWidth, yOffset + lowLevel);
            }
            x += unitWidth;
        }
    }

    private void drawDifferentialManchester(Graphics g, String data, int yOffset) {
        int x = 40;
        int lastLevel = yOffset + highLevel;
        for (int i = 0; i < data.length(); i++) {
            int midX = x + unitWidth / 2;
            if (data.charAt(i) == '0') {
                g.drawLine(x, lastLevel, midX, lastLevel);
                lastLevel = lastLevel == yOffset + highLevel ? yOffset + lowLevel : yOffset + highLevel;
                g.drawLine(midX, lastLevel, x + unitWidth, lastLevel);
            } else {
                lastLevel = lastLevel == yOffset + highLevel ? yOffset + lowLevel : yOffset + highLevel;
                g.drawLine(x, lastLevel, midX, lastLevel);
                g.drawLine(midX, lastLevel, x + unitWidth, lastLevel);
            }
            x += unitWidth;
        }
    }

    @FunctionalInterface
    interface EncodingDrawer {
        void draw(Graphics g, String data, int yOffset);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            LineEncodingAssignment frame = new LineEncodingAssignment();
            frame.setVisible(true);
        });
    }
}
