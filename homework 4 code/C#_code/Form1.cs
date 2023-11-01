using System;
using System.IO;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.Common;
using System.Collections;
using System.Xml.Linq;

namespace Homework4
{
    public partial class Form1 : Form
    {
        private List<Label> labels = new List<Label>();
        private List<TextBox> intervals = new List<TextBox>();
        private List<double[]> variables = new List<double[]>();
        private Button generateButton;

        private int numberOfValues = 100;

        Random random = new Random();
        public Form1()
        {
            InitializeComponent();
            textBox1.Text = "1";
        }

        private void Form1_Load(object sender, EventArgs e)
        {

            int n = int.Parse(textBox1.Text);

            RemoveExcessControls();

            GenerateVariables(n);
        }

        private void GenerateVariables(int n)
        {
            if (generateButton != null)
            {
                Controls.Remove(generateButton);
                generateButton.Dispose();
                generateButton = null;
            }

            for (int i = 0; i < n; i++)
            {
                Console.WriteLine("Variable n." + (i + 1) + ":");

                double[] values = new double[numberOfValues];

                Label label = new Label();
                label.Text = "Variable n." + (i + 1) + ":";
                label.Location = new Point(20, 50 + i * 30);
                labels.Add(label);

                TextBox textBox = new TextBox();
                textBox.Name = "textBoxInterval" + (i + 1);
                textBox.Location = new Point(120, 50 + i * 30);
                intervals.Add(textBox);

                this.Controls.Add(label);
                this.Controls.Add(textBox);

                for (int j = 0; j < numberOfValues; j++)
                {
                    double randomValue = random.NextDouble();
                    Console.WriteLine("Value " + (j + 1) + ": " + randomValue);
                    values[j] = randomValue;
                }
                variables.Add(values);
            }

            generateButton = new Button();
            generateButton.Text = "Generate";
            generateButton.Location = new Point(120, 50 + n * 30);
            generateButton.Click += CumulativeFrequency_Click;
            this.Controls.Add(generateButton);
        }

        private void CumulativeFrequency_Click(object sender, EventArgs e)
        {
            Dictionary<int, Dictionary<double, int>> cumulativeFrequency = new Dictionary<int, Dictionary<double, int>>();

            int[] intervalCounts = new int[variables.Count];
            int i = 0;

            foreach (var interval in intervals)
            {
                int intervalValue = 0;
                string text = interval.Text;
                if (!string.IsNullOrEmpty(text) && int.TryParse(text, out intervalValue))
                {
                    intervalCounts[i] = intervalValue;
                }
                else
                {
                    intervalCounts[i] = 0;
                }
                i++;
            }

            i = 0;

            foreach (var variable in variables)
            {
                Console.WriteLine("Variable n."+(i)+" Count values: "+(variable.Length));
                List<double> intervalsValues = new List<double>();
                double max = variable.Max();
                double min = variable.Min();
                Console.WriteLine("Max: " + max + " - Min: " +min);
                int numIntervals = intervalCounts[i];
                double intervalWidth = (max - min) / numIntervals;

                Dictionary<double, int> intervalHistogram = new Dictionary<double, int>();

                for (int j = 0; j < numIntervals; j++)
                {
                    double intervalStart = min + j * intervalWidth;
                    double intervalEnd = intervalStart + intervalWidth;

                    if (j == numIntervals - 1)
                    {
                        int count = variable.Count(value => value >= intervalStart && value <= max);
                        intervalHistogram[intervalStart] = count;
                    }
                    else
                    {
                        int count = variable.Count(value => value >= intervalStart && value < intervalEnd);
                        intervalHistogram[intervalStart] = count;
                    }
                }

                foreach (var kvp in intervalHistogram)
                {
                    Console.WriteLine("Interval " + kvp.Key + ": Count " + kvp.Value);
                }
                cumulativeFrequency.Add(i, intervalHistogram);
                i++;
            }
            GenerateKJointDistribution(cumulativeFrequency);
        }

        private void GenerateKJointDistribution(Dictionary<int, Dictionary<double, int>> cumulativeFrequency)
        {
            dataGridView1.Rows.Clear();
            dataGridView1.Columns.Clear();

            List<Dictionary<int, double>> jointDistribution = new List<Dictionary<int, double>>();
            List<List<double>> variableIntervals = new List<List<double>>();

            int totalCombination = 0;
            double totalFrequency = 1.0;
            double percentageFrequency = 0;

            foreach (var variableProbabilities in cumulativeFrequency)
            {
                variableIntervals.Add(variableProbabilities.Value.Keys.ToList());
            }

            for (int i = 0; i < variableIntervals.Count; i++)
            {
                dataGridView1.Columns.Add("Variable n." + (i + 1), "Variable n." + (i + 1));
            }

            int[] indices = new int[variableIntervals.Count];

            dataGridView1.Columns.Add("Frequency", "Frequency");

            while (true)
            {
                totalCombination++;
                Dictionary<int, double> jointProbabilities = new Dictionary<int, double>();
                double frequency = 1;

                for (int i = 0; i < variableIntervals.Count; i++)
                {
                    jointProbabilities[i] = variableIntervals[i][indices[i]];

                    int variableIndex = cumulativeFrequency.Keys.ElementAt(i);
                    double intervalValue = jointProbabilities[i];

                    frequency *= cumulativeFrequency[variableIndex][intervalValue];
                }

                totalFrequency += frequency;

                percentageFrequency = (frequency / totalFrequency) * 100;

                int rowIndex = dataGridView1.Rows.Add();

                for (int i = 0; i < variableIntervals.Count; i++)
                {
                    dataGridView1.Rows[rowIndex].Cells[i].Value = jointProbabilities[i];
                }

                dataGridView1.Rows[rowIndex].Cells["Frequency"].Value = percentageFrequency.ToString("F2") + " %";

                int incrementIndex = variableIntervals.Count - 1;
                indices[incrementIndex]++;

                while (incrementIndex >= 0 && indices[incrementIndex] >= variableIntervals[incrementIndex].Count)
                {
                    indices[incrementIndex] = 0;
                    incrementIndex--;

                    if (incrementIndex >= 0)
                    {
                        indices[incrementIndex]++;
                    }
                }

                if (incrementIndex < 0)
                {
                    break;
                }
            }
            Console.WriteLine("Total Combination: " + totalCombination);
        }


        private void button1_Click(object sender, EventArgs e)
        {
            int n = int.Parse(textBox1.Text);

            RemoveExcessControls();

            GenerateVariables(n);
        }

        private void RemoveExcessControls()
        {
            for (int i = 0; i < labels.Count; i++)
            {
                Controls.Remove(labels[i]);
                labels[i].Dispose();

                Controls.Remove(intervals[i]);
                intervals[i].Dispose();
            }

            labels.Clear();
            intervals.Clear();
            variables.Clear();
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }
    }
}
